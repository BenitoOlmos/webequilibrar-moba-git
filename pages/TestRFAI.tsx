import React, { useState, useEffect } from 'react';
import { Activity, Brain, HeartPulse, UserCircle2, ArrowRight, ShieldCheck, ArrowLeft, CheckCircle2, BarChart3 } from 'lucide-react';

const questions = [
    // ACTIVACIÓN FISIOLÓGICA (1-7)
    "1. Siento tensión muscular sin darme cuenta.",
    "2. Me cuesta dormir o despierto con el cuerpo activado.",
    "3. Mi respiración se vuelve superficial cuando me inquieto.",
    "4. Siento opresión corporal frente a situaciones cotidianas.",
    "5. Mi cuerpo se acelera sin motivo claro.",
    "6. Me cuesta relajar el cuerpo incluso cuando puedo hacerlo.",
    "7. Mi digestión se altera bajo presión.",

    // ACTIVACIÓN MENTAL (8-14)
    "8. Mi mente se queda pegada a un tema.",
    "9. Anticipo escenarios negativos.",
    "10. Siento urgencia mental constante.",
    "11. Me critico internamente con dureza.",
    "12. Me cuesta apagar la mente.",
    "13. Sobreanalizo situaciones.",
    "14. Me cuesta estar presente.",

    // ACTIVACIÓN EMOCIONAL (15-21)
    "15. Me irrito con facilidad.",
    "16. Siento angustia sin causa clara.",
    "17. Siento culpa aunque sé que no corresponde.",
    "18. Mis emociones suben rápido.",
    "19. Me cuesta tolerar frustraciones.",
    "20. Me siento hiperreactivo(a).",
    "21. Me cuesta sostener calma emocional.",

    // REGULACIÓN (22-28)
    "22. Noto cuándo me estoy acelerando.",
    "23. Puedo calmarme sin dañarme.",
    "24. Puedo hablarme con respeto.",
    "25. Logro volver a estabilidad.",
    "26. Puedo pedir apoyo.",
    "27. Tengo prácticas que me regulan.",
    "28. Puedo volver al presente."
];

const scaleOptions = [
    { value: 0, label: "Nunca" },
    { value: 1, label: "Rara vez" },
    { value: 2, label: "A veces" },
    { value: 3, label: "Frecuente" },
    { value: 4, label: "Casi siempre" }
];

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxdwl3tIbjnebuTGYZGmgLVWUFVPyIHsoxJi9uP1zHO4yN4YuBspUQXVGwNyabAZARF5A/exec";

interface ResultsType {
    AF: number;
    AM: number;
    AE: number;
    R: number;
    ITA: number;
    Re: number;
    IDSE: number;
    interpretacion: string;
    perfil: string;
    afText: string;
    amText: string;
    aeText: string;
    rText: string;
}

const TestRFAI: React.FC = () => {
    const [step, setStep] = useState(0); // 0: UserInfo, 1: AF, 2: AM, 3: AE, 4: R
    const [userInfo, setUserInfo] = useState({ name: '', email: '' });
    const [answers, setAnswers] = useState<number[]>(Array(28).fill(-1));
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [results, setResults] = useState<ResultsType | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Evitar salto al enfocar un input en celular
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [step]);

    const handleUserInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
        if (error) setError(null);
    };

    const handleAnswerChange = (index: number, value: number) => {
        const newAnswers = [...answers];
        newAnswers[index] = value;
        setAnswers(newAnswers);
        if (error) setError(null);
    };

    const validateStep = (currentStep: number) => {
        if (currentStep === 0) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!userInfo.name.trim() || !userInfo.email.trim()) {
                setError("Por favor, completa nombre y correo para continuar.");
                return false;
            }
            if (!emailRegex.test(userInfo.email)) {
                setError("El formato del correo electrónico es inválido.");
                return false;
            }
        } else {
            const startIndex = (currentStep - 1) * 7;
            const endIndex = startIndex + 7;
            const stepAnswers = answers.slice(startIndex, endIndex);
            if (stepAnswers.includes(-1)) {
                setError("Por favor, responde todas las preguntas antes de avanzar.");
                return false;
            }
        }
        setError(null);
        return true;
    };

    const nextStep = () => {
        if (validateStep(step)) {
            setStep(prev => prev + 1);
        }
    };

    const prevStep = () => {
        setStep(prev => prev - 1);
        setError(null);
    };

    const calculateResults = (): ResultsType => {
        const sumRange = (start: number, end: number) =>
            answers.slice(start, end).reduce((a, b) => a + (b === -1 ? 0 : b), 0);

        const AF = sumRange(0, 7);
        const AM = sumRange(7, 14);
        const AE = sumRange(14, 21);
        const R = sumRange(21, 28);

        const ITA = AF + AM + AE;
        const Re = R * 3;
        const IDSE = ITA - Re;

        let interpretacion = "";
        if (IDSE <= -20) interpretacion = "Regulación robusta. Excedente de recursos que facilita resiliencia y salud.";
        else if (IDSE >= -19 && IDSE <= 19) interpretacion = "Balance funcional. Relación proporcionada entre demandas internas y capacidad de modulación.";
        else if (IDSE >= 20 && IDSE <= 49) interpretacion = "Desbalance moderado. Consumo excesivo de recursos por sobre-activación de las bases biológicas.";
        else interpretacion = "Desbalance alto. Consumo excesivo prolongado que puede llevar a síndromes tensionales, disregulación anímica o agotamiento funcional.";

        let perfil = "No definido claramente";
        if (ITA <= 27 && R >= 10) perfil = "Regulado";
        else if (ITA >= 54 && R >= 10 && R <= 18) perfil = "Reactivo";
        else if (ITA >= 54 && R <= 9) perfil = "Desbordado";
        else if (ITA <= 27 && R <= 9) perfil = "Inhibido";
        else if (ITA >= 28 && ITA <= 53 && R >= 19) perfil = "Adaptativo";
        else perfil = "Transicional";

        const getActvText = (score: number, type: 'AF' | 'AM' | 'AE') => {
            if (type === 'AF') {
                if (score <= 9) return "Tu cuerpo se mantiene en un estado de calma base; las señales de tensión física son mínimas.";
                if (score <= 18) return "Experimentas tensiones corporales ocasionales o alteraciones leves en el sueño y digestión ante el estrés.";
                return "Tu cuerpo reacciona con intensidad; la tensión muscular, opresión o fatiga son constantes y difíciles de ignorar.";
            } else if (type === 'AM') {
                if (score <= 9) return "Posees claridad mental y capacidad para estar presente sin rumiación excesiva.";
                if (score <= 18) return "En momentos de presión, tu mente tiende a sobreanalizar o anticipar escenarios negativos.";
                return "Experimentas una \"urgencia mental\" constante; te cuesta apagar los pensamientos y el juicio interno es severo.";
            } else {
                if (score <= 9) return "Tus emociones son estables y proporcionales a las situaciones.";
                if (score <= 18) return "Presentas fluctuaciones emocionales o irritabilidad cuando las demandas externas aumentan.";
                return "Sientes una hiperreactividad emocional; la angustia o la culpa aparecen con rapidez y son difíciles de sostener.";
            }
        };

        const getRegText = (score: number) => {
            if (score <= 9) return "Tus herramientas para calmarte son escasas. Es probable que te sientas desprotegido(a) frente a tus propios estados de activación.";
            if (score <= 18) return "Reconoces cuándo te aceleras y tienes algunas prácticas para volver a la calma, aunque no siempre son suficientes en crisis.";
            return "Tienes una relación sólida contigo mismo(a); sabes pedir apoyo, hablarte con respeto y volver a la estabilidad de forma autónoma.";
        };

        const afText = getActvText(AF, 'AF');
        const amText = getActvText(AM, 'AM');
        const aeText = getActvText(AE, 'AE');
        const rText = getRegText(R);

        return { AF, AM, AE, R, ITA, Re, IDSE, interpretacion, perfil, afText, amText, aeText, rText };
    };

    const handleSubmit = async () => {
        if (!validateStep(4)) return;

        setError(null);
        setIsSubmitting(true);

        const calculatedResults = calculateResults();

        // Creamos un objeto URLSearchParams para enviar como formulario clásico (x-www-form-urlencoded)
        // Esto es mucho más seguro para evitar que el navegador o bloqueadores eliminen campos en el modo 'no-cors'
        const formData = new URLSearchParams();
        formData.append("name", userInfo.name);
        formData.append("email", userInfo.email);
        formData.append("AF", calculatedResults.AF.toString());
        formData.append("AM", calculatedResults.AM.toString());
        formData.append("AE", calculatedResults.AE.toString());
        formData.append("R", calculatedResults.R.toString());
        formData.append("ITA", calculatedResults.ITA.toString());
        formData.append("Re", calculatedResults.Re.toString());
        formData.append("IDSE", calculatedResults.IDSE.toString());
        formData.append("interpretacion", calculatedResults.interpretacion);
        formData.append("perfil", calculatedResults.perfil);

        try {
            await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData.toString()
            });

            setResults(calculatedResults);
            setShowResults(true);
        } catch (err) {
            console.error("Error al enviar los datos:", err);
            setError("Hubo un problema al enviar sus resultados. Por favor intente más tarde.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderProgressBar = () => {
        const totalSteps = 5;
        const progress = ((step + 1) / totalSteps) * 100;
        return (
            <div className="w-full max-w-2xl mx-auto mb-8 md:mb-12 px-2">
                <div className="flex justify-between mb-2">
                    {['Inicio', 'Cuerpo', 'Mente', 'Emoción', 'Regulación'].map((lbl, idx) => (
                        <span key={idx} className={`text-[10px] md:text-xs font-bold uppercase tracking-wider ${step >= idx ? 'text-brand-primary' : 'text-slate-300'} transition-colors duration-300`}>
                            {lbl}
                        </span>
                    ))}
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-brand-primary transition-all duration-500 ease-in-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        );
    };

    if (showResults && results) {
        const maxScore = 28;
        const maxITA = 84;
        const getPercent = (val: number, max: number = maxScore) => Math.min((val / max) * 100, 100);

        return (
            <div className="py-12 md:py-24 bg-brand-surface min-h-screen">
                <div className="max-w-4xl mx-auto px-4 sm:px-6">
                    <div className="bg-white rounded-2xl shadow-luxury p-6 md:p-12 mb-8 animate-fade-in-up">

                        <div className="text-center mb-8">
                            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                            <h2 className="text-3xl font-serif text-brand-heading mb-2">Resultados TARP-21</h2>
                            <p className="text-slate-500">Hola {userInfo.name.split(' ')[0]}, aquí está tu reporte estructurado.</p>
                        </div>

                        {/* Nivel 1: Perfil de Activación */}
                        <div className="mb-12">
                            <h3 className="text-2xl font-serif text-brand-heading border-b border-brand-sand pb-3 mb-6 flex items-center gap-2">
                                <Activity className="text-brand-primary" /> Nivel 1: Perfil de Activación
                            </h3>
                            <div className="space-y-6">
                                {/* AF */}
                                <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                                    <div className="flex justify-between text-sm md:text-base mb-2 font-bold text-slate-700">
                                        <span>Activación Fisiológica (AF)</span>
                                        <span className={results.AF >= 19 ? 'text-orange-500' : 'text-slate-500'}>{results.AF} / 28</span>
                                    </div>
                                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-3">
                                        <div className="bg-orange-400 h-full rounded-full transition-all duration-1000" style={{ width: `${getPercent(results.AF)}%` }}></div>
                                    </div>
                                    <p className="text-sm text-slate-600 leading-relaxed font-light">{results.afText}</p>
                                </div>
                                {/* AM */}
                                <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                                    <div className="flex justify-between text-sm md:text-base mb-2 font-bold text-slate-700">
                                        <span>Activación Mental (AM)</span>
                                        <span className={results.AM >= 19 ? 'text-amber-500' : 'text-slate-500'}>{results.AM} / 28</span>
                                    </div>
                                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-3">
                                        <div className="bg-amber-400 h-full rounded-full transition-all duration-1000" style={{ width: `${getPercent(results.AM)}%` }}></div>
                                    </div>
                                    <p className="text-sm text-slate-600 leading-relaxed font-light">{results.amText}</p>
                                </div>
                                {/* AE */}
                                <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                                    <div className="flex justify-between text-sm md:text-base mb-2 font-bold text-slate-700">
                                        <span>Activación Emocional (AE)</span>
                                        <span className={results.AE >= 19 ? 'text-rose-500' : 'text-slate-500'}>{results.AE} / 28</span>
                                    </div>
                                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-3">
                                        <div className="bg-rose-400 h-full rounded-full transition-all duration-1000" style={{ width: `${getPercent(results.AE)}%` }}></div>
                                    </div>
                                    <p className="text-sm text-slate-600 leading-relaxed font-light">{results.aeText}</p>
                                </div>
                            </div>
                        </div>

                        {/* Nivel 2: Perfil de Regulación */}
                        <div className="mb-12">
                            <h3 className="text-2xl font-serif text-brand-heading border-b border-brand-sand pb-3 mb-6 flex items-center gap-2">
                                <ShieldCheck className="text-brand-primary" /> Nivel 2: Perfil de Regulación
                            </h3>
                            <div className="bg-brand-primary/5 p-5 md:p-6 rounded-xl border border-brand-primary/20">
                                <div className="flex justify-between text-base md:text-lg mb-3 font-bold text-brand-primary">
                                    <span>Capacidad Regulatoria (R)</span>
                                    <span>{results.R} / 28</span>
                                </div>
                                <div className="w-full bg-brand-light h-3 rounded-full overflow-hidden mb-4 shadow-inner">
                                    <div className="bg-brand-primary h-full rounded-full transition-all duration-1000" style={{ width: `${getPercent(results.R)}%` }}></div>
                                </div>
                                <p className="text-sm md:text-base text-slate-700 leading-relaxed">{results.rText}</p>
                            </div>
                        </div>

                        {/* Nivel 3: Resultado Integrado (IDS-E) */}
                        <div className="mb-8">
                            <h3 className="text-2xl font-serif text-brand-heading border-b border-brand-sand pb-3 mb-6 flex items-center gap-2">
                                <BarChart3 className="text-brand-primary" /> Nivel 3: Resultado Integrado
                            </h3>

                            <div className="bg-brand-sand/10 rounded-2xl p-6 md:p-10 text-center border border-brand-sand/50">
                                <p className="text-xs text-brand-gold uppercase tracking-[0.2em] font-bold mb-2">Diagnóstico de Balance</p>
                                <h3 className="text-4xl md:text-5xl font-serif text-brand-primary mb-6">{results.perfil}</h3>

                                <div className="inline-block bg-white px-6 py-4 rounded-xl shadow-sm border border-slate-100 mb-6 relative hover:-translate-y-1 transition-transform">
                                    <span className="block text-[10px] md:text-xs uppercase tracking-wider text-slate-400 mb-1">Índice Biológico de Sobrecarga (IDS-E)</span>
                                    <span className={`text-4xl font-bold ${results.IDSE > 19 ? 'text-red-500' : 'text-brand-primary'}`}>{results.IDSE}</span>
                                </div>

                                <p className="text-sm md:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto mb-10 pb-6 border-b border-brand-sand/50">
                                    <strong className="text-slate-800">Interpretación Global:</strong> {results.interpretacion}
                                </p>

                                {/* Gráfico de Síntesis */}
                                <div>
                                    <h4 className="text-sm uppercase tracking-widest font-bold text-slate-400 mb-8">Gráfico de Síntesis (Carga vs Recursos)</h4>

                                    <div className="max-w-md mx-auto relative h-48 md:h-64 flex items-end justify-center gap-8 md:gap-16 border-b-2 border-slate-200 pb-2 px-4">

                                        {/* Barra ITA */}
                                        <div className="relative group w-20 md:w-24 h-full flex flex-col justify-end items-center">
                                            <div
                                                className="w-full bg-slate-300 rounded-t-lg transition-all duration-1000 relative shadow-inner"
                                                style={{ height: `${getPercent(results.ITA, maxITA)}%` }}
                                            >
                                                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-sm font-bold text-slate-700">{results.ITA}</span>
                                            </div>
                                            <span className="absolute -bottom-8 text-xs font-bold text-slate-500 text-center leading-tight">Carga<br />(ITA)</span>
                                        </div>

                                        {/* Linea de balance (decorativa) */}
                                        <div className="absolute top-1/2 left-0 w-full border-t border-dashed border-slate-300 opacity-50 z-0 pointer-events-none"></div>

                                        {/* Barra Re */}
                                        <div className="relative group w-20 md:w-24 h-full flex flex-col justify-end items-center">
                                            <div
                                                className="w-full bg-brand-primary/80 rounded-t-lg transition-all duration-1000 relative shadow-inner"
                                                style={{ height: `${getPercent(results.Re, maxITA)}%` }}
                                            >
                                                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-sm font-bold text-brand-primary">{results.Re}</span>
                                            </div>
                                            <span className="absolute -bottom-8 text-xs font-bold text-brand-primary text-center leading-tight">Recursos<br />(Re)</span>
                                        </div>

                                    </div>
                                    <div className="mt-12 text-xs text-slate-400 max-w-sm mx-auto">
                                        Si la barra azul (Recursos) es mayor a la gris (Carga), hay un balance funcional saludable.
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="text-center mt-12 bg-slate-50 p-6 rounded-xl border border-slate-100">
                            <p className="text-xs md:text-sm text-slate-500 font-light italic">
                                * Nota: Este resultado no es un instrumento diagnóstico y tiene fines psicoeducativos.
                                Debe complementarse con evaluación profesional para un diagnóstico clínico y tratamiento adecuado.
                            </p>

                            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
                                <button
                                    onClick={() => { setShowResults(false); setAnswers(Array(28).fill(-1)); setUserInfo({ name: '', email: '' }); setStep(0); window.scrollTo(0, 0) }}
                                    className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded hover:bg-slate-50 transition-colors text-xs font-bold tracking-widest uppercase w-full sm:w-auto"
                                >
                                    Repetir Test
                                </button>
                                <a
                                    href="/#/reserva"
                                    className="px-6 py-3 bg-brand-primary text-white rounded hover:bg-brand-primary/90 transition-colors text-xs font-bold tracking-widest uppercase shadow-md shadow-brand-primary/20 w-full sm:w-auto"
                                >
                                    Agendar Hora de Evaluación
                                </a>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        );
    }

    // Vista de Preguntas
    const getStepContent = () => {
        switch (step) {
            case 0:
                return (
                    <div className="animate-fade-in-up">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl md:text-4xl font-serif text-brand-heading mb-4">Bienvenido al Test TARP-21</h2>
                            <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
                                Este test estima el balance entre tu carga interna y tus recursos regulatorios en los últimos 7 días.
                            </p>
                        </div>
                        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-luxury space-y-6 border border-brand-sand/30">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <UserCircle2 size={16} className="text-brand-primary" /> Nombre Completo
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={userInfo.name}
                                    onChange={handleUserInfoChange}
                                    className="w-full px-4 py-3 bg-slate-50 hover:bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all text-brand-heading"
                                    placeholder="Ej. Juan Pérez"
                                    autoComplete="name"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <Activity size={16} className="text-brand-primary" /> Correo Electrónico
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={userInfo.email}
                                    onChange={handleUserInfoChange}
                                    className="w-full px-4 py-3 bg-slate-50 hover:bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all text-brand-heading"
                                    placeholder="juan@ejemplo.com"
                                    autoComplete="email"
                                />
                            </div>
                        </div>
                    </div>
                );
            case 1:
                return <QuestionSection title="Activación Fisiológica" icon={<Activity />} startIndex={0} />;
            case 2:
                return <QuestionSection title="Activación Mental" icon={<Brain />} startIndex={7} />;
            case 3:
                return <QuestionSection title="Activación Emocional" icon={<HeartPulse />} startIndex={14} />;
            case 4:
                return <QuestionSection title="Regulación Interna" icon={<ShieldCheck />} startIndex={21} />;
            default:
                return null;
        }
    };

    const QuestionSection = ({ title, icon, startIndex }: { title: string, icon: React.ReactNode, startIndex: number }) => (
        <div className="animate-fade-in-up">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-light text-brand-primary mb-4">
                    {icon}
                </div>
                <h2 className="text-2xl md:text-3xl font-serif text-brand-heading mb-2">{title}</h2>
                <p className="text-xs uppercase tracking-widest font-bold text-brand-gold">Parte {(startIndex / 7) + 1} de 4</p>
            </div>
            <div className="bg-white rounded-2xl shadow-luxury border border-brand-sand/30 overflow-hidden">
                <div className="bg-brand-sand/30 p-4 border-b border-brand-sand text-center">
                    <p className="text-slate-600 text-sm font-medium">¿Cuánto te identifican estas afirmaciones en los <span className="font-bold text-brand-primary">últimos 7 días</span>?</p>
                </div>
                <div className="p-4 md:p-8 space-y-8 divide-y divide-slate-100">
                    {questions.slice(startIndex, startIndex + 7).map((q, idx) => (
                        <QuestionRow key={startIndex + idx} index={startIndex + idx} question={q} answers={answers} setAnswer={handleAnswerChange} />
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="py-12 md:py-24 bg-brand-surface min-h-screen">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">

                {renderProgressBar()}

                <div className="min-h-[400px]">
                    {getStepContent()}
                </div>

                {error && (
                    <div className="mt-8 bg-red-50 text-red-600 p-4 rounded-xl text-center border border-red-100 animate-shake">
                        <span className="font-medium text-sm">{error}</span>
                    </div>
                )}

                {/* Controles de Navegación Stepper */}
                <div className="mt-8 flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-brand-sand/50">
                    <button
                        onClick={prevStep}
                        disabled={step === 0 || isSubmitting}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-all ${step === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-50 hover:text-brand-primary'}`}
                    >
                        <ArrowLeft size={16} /> Atrás
                    </button>

                    {step < 4 ? (
                        <button
                            onClick={nextStep}
                            className="flex items-center gap-2 px-8 py-3 bg-brand-heading text-white rounded-xl hover:bg-brand-primary transition-all font-bold uppercase tracking-widest text-xs shadow-md shadow-brand-heading/20"
                        >
                            Continuar <ArrowRight size={16} />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="flex items-center gap-2 px-8 py-3 bg-brand-primary text-white rounded-xl hover:bg-brand-primary/90 transition-all font-bold uppercase tracking-widest text-xs shadow-lg shadow-brand-primary/30 disabled:opacity-75 disabled:cursor-wait"
                        >
                            {isSubmitting ? 'Procesando...' : 'Ver Resultados'}
                            {!isSubmitting && <CheckCircle2 size={16} />}
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
};

// Componente individual de pregunta optimizado para móvil (Radio UI botones grandes)
interface QuestionRowProps {
    index: number;
    question: string;
    answers: number[];
    setAnswer: (i: number, v: number) => void;
}

const QuestionRow: React.FC<QuestionRowProps> = ({ index, question, answers, setAnswer }) => {
    return (
        <div className="pt-8 first:pt-4">
            <p className="font-medium text-slate-700 mb-5 text-base md:text-lg leading-snug">{question}</p>
            {/* Container flex wrap para mejor fluidez en móvil */}
            <div className="flex flex-wrap md:flex-nowrap gap-2 md:gap-3">
                {scaleOptions.map((opt) => {
                    const isSelected = answers[index] === opt.value;
                    return (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => setAnswer(index, opt.value)}
                            className={`
                flex-1 min-w-[30%] md:min-w-0 flex flex-col items-center justify-center py-3 px-1 md:py-4 rounded-xl border-2 transition-all active:scale-95
                ${isSelected
                                    ? 'bg-brand-primary border-brand-primary text-white shadow-md'
                                    : 'bg-white border-slate-100 text-slate-500 hover:border-brand-primary/30 hover:bg-brand-light/20'}
              `}
                        >
                            <span className={`text-lg md:text-xl font-bold mb-1 ${isSelected ? 'text-white' : 'text-slate-700'}`}>{opt.value}</span>
                            <span className={`text-[10px] md:text-[11px] font-medium uppercase tracking-wider text-center leading-tight ${isSelected ? 'text-white/90' : 'text-slate-400'}`}>
                                {opt.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default TestRFAI;
