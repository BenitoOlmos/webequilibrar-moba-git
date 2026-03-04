import React, { useState, useEffect } from 'react';
import { Activity, Brain, HeartPulse, UserCircle2, ArrowRight, ShieldCheck, ArrowLeft, CheckCircle2, BarChart3, PlayCircle } from 'lucide-react';

// Video URLs (YouTube Embeds)
const vDesbordado = 'https://www.youtube.com/embed/SU_K-Qt4tf8';
const vSobreAdaptado = 'https://www.youtube.com/embed/8rIIp-15huw';
const vHiperRegulado = 'https://www.youtube.com/embed/X7v43d7U4io';
const vInhibido = 'https://www.youtube.com/embed/liHSg0FOT9g';
const vHiperReactivo = 'https://www.youtube.com/embed/Ke5JnAlBe7Y';

const questions = [
    // ACTIVACIÓN FISIOLÓGICA (1-7)
    "1. Siento tensión muscular constantemente.",
    "2. Me cuesta conciliar el sueño o me despierto con sobresaltos en la noche.",
    "3. Me doy cuenta que suspiro seguido o que mi respiración está acelerada.",
    "4. Mi cuerpo se siente presionado a diario.",
    "5. Siento como si funcionara de manera acelerada, sin motivo claro.",
    "6. Cuando intento relajar el cuerpo me aparece dolor de cuello u hombros.",
    "7. Tengo síntomas de alteraciones digestivas/estomacales de manera recurrente.",

    // ACTIVACIÓN MENTAL (8-14)
    "8. Mi mente se obsesiona con algunos temas y no deja de analizarlos.",
    "9. Mi mente tiende a crear escenarios negativos o catastróficos.",
    "10. No paro de pensar en todo el día.",
    "11. Me critico internamente con dureza.",
    "12. Me cuesta desconectarme de lo que pienso al intentar dormir.",
    "13. Sobre analizo las situaciones, buscando estar preparado/a para lo que venga.",
    "14. Tiendo a tener mi atención puesta en el futuro y/o el pasado.",

    // ACTIVACIÓN EMOCIONAL (15-21)
    "15. Me irrito con facilidad.",
    "16. Siento frecuentemente emociones intensas en el pecho.",
    "17. Siento culpa por las cosas que ocurren en mi vida.",
    "18. Mis emociones se intensifican de manera abrupta.",
    "19. Me cuesta tolerar frustraciones.",
    "20. Me siento incapaz de procesar lo que siento en estos días.",
    "21. Los períodos de calma tienden a durar poco tiempo.",

    // REGULACIÓN (22-28)
    "22. Noto cuándo mi cuerpo se acelera y puedo calmarlo.",
    "23. Soy capaz de volver a sentirme seguro/a cuando pierdo la calma.",
    "24. Mi diálogo interno es positivo y me trato internamente como si fuera mi mejor amigo/a.",
    "25. Tengo la capacidad de dejar de pensar en lo que podría pasar.",
    "26. Sé reconocer cuando necesito ayuda y soy capaz de pedir apoyo.",
    "27. Tengo prácticas de autocuidado diario que me regulan.",
    "28. Puedo reconocer cuando mi pensamiento se obsesiona y sé cómo calmarlo."
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
    interrelacion: string;
    resumenDimensional: string;
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

        let perfil = "Indeterminado";
        if (ITA <= 27) {
            if (R >= 10) perfil = "Hiper Regulado";
            else perfil = "Inhibido";
        } else if (ITA >= 28 && ITA <= 54) {
            if (R >= 19) perfil = "Sobre Adaptado";
            else perfil = "Indeterminado";
        } else if (ITA >= 55) {
            if (R <= 9) perfil = "Desbordado";
            else if (R >= 10 && R <= 18) perfil = "Hiper Reactivo";
            else if (R >= 19) {
                perfil = "Indeterminado";
            }
        }

        if (perfil === "Indeterminado") {
            console.warn("RFAI indeterminado", { AF, AM, AE, R, ITA, IDSE });
        }

        let interrelacion = "Perfil de Estabilidad Funcional.";
        if (AF <= 9 && AM <= 9 && AE <= 9) {
            interrelacion = "Estado depresivo.";
        } else if (AF >= 19 && AM >= 19 && AE >= 19) {
            interrelacion = "Desborde generalizado del sistema.";
        } else if (AM >= 19 && AE >= 19) {
            interrelacion = "Funcionalidad sostenida con sobre pensamiento y desbordes emocionales.";
        } else if (AF >= AM + 6 && AF >= AE + 6) {
            interrelacion = "Funcionalidad sostenida con desregulación fisiológica.";
        } else if (AM >= AE + 6) {
            interrelacion = "Funcionalidad sostenida desde un predominio cognitivo sobre lo emocional.";
        } else if (AE >= AM + 6) {
            interrelacion = "Funcionalidad sostenida desde un predominio emocional con baja elaboración cognitiva.";
        } else if (Math.abs(AF - AM) < 6 && Math.abs(AF - AE) < 6 && Math.abs(AM - AE) < 6) {
            interrelacion = "Balance funcional sin diferencias marcadas igual o superiores a 6 puntos.";
        }

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

        const getRegText = (score: number, r_ita: number, r_idse: number, isBajaActivacion: boolean) => {
            if (score >= 19 && r_idse >= 20) return "Sobre esfuerzo en la compensación de síntomas.";
            if (score <= 9 && isBajaActivacion) return "Atención a síntomas depresivos.";

            if (score <= 9) return "Dificultad para recuperar equilibrio.";
            if (score <= 18) return "Recursos presentes pero inestables.";
            return "Capacidad de retorno al equilibrio instalada.";
        };

        const afText = getActvText(AF, 'AF');
        const amText = getActvText(AM, 'AM');
        const aeText = getActvText(AE, 'AE');
        const rText = getRegText(R, ITA, IDSE, ITA <= 27 || (AF <= 9 && AM <= 9 && AE <= 9));

        const level28 = (score: number) => {
            if (score <= 9) return "bajo";
            if (score <= 18) return "medio";
            return "alto";
        };

        const resumenDimensional = `Fisiológicamente ${level28(AF)} · Emocionalmente ${level28(AE)} · Racionalmente ${level28(AM)} · Regulación ${level28(R)}`;

        return { AF, AM, AE, R, ITA, Re, IDSE, interpretacion, perfil, afText, amText, aeText, rText, interrelacion, resumenDimensional };
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
        formData.append("perfil", `${calculatedResults.perfil} | ${calculatedResults.interrelacion}`);
        formData.append("resumen_dimensional", calculatedResults.resumenDimensional);

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
            window.scrollTo(0, 0);
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
        // HTML Profile Content Dictionary
        const profileContent: Record<string, { subtitle: string; lead: string; definition: string; origin: string; video: string; payment: string }> = {
            "Hiper Regulado": {
                subtitle: "HIPER REGULADO",
                lead: "Tienes un alto control sistemático sobre tus emociones y reacciones, pero a costa de un gran esfuerzo y tensión latente. Estás en alerta, pero lo internalizas.",
                definition: "Hiper Regulado es cuando tu sistema se ha vuelto experto en contener y apagar las señales de estrés para mantener la funcionalidad en el exterior o no ser una carga para otros. Logras funcionar bien mientras mantienes todo ajustado internamente.",
                origin: "En entornos donde expresar emociones no era seguro, o donde debías sostener la etiqueta del 'fuerte' o el 'racional', el cerebro humano aprende a sobre-regularse. El problema es que el circuito de control queda encendido y el costo biológico silencioso es altísimo.",
                video: "https://www.youtube.com/embed/X7v43d7U4io",
                payment: "https://mpago.la/1oGPijS"
            },
            "Desbordado": {
                subtitle: "DESBORDADO",
                lead: "Sientes que las exigencias superan ampliamente tus herramientas psíquicas y biológicas. Tu sistema está en emergencia y la fatiga o desregulación empiezan a dominar de forma errática.",
                definition: "Desborde ocurre cuando la carga interna o relacional es altísima y tu capacidad de modulación se quiebra, empujando al sistema nervioso a sostener un estado de hiperexcitación o emergencia generalizada.",
                origin: "Pasa después de amplios períodos intentando 'sostener o tragar' algo sin descansos ni pausas biológicas reales. El cerebro se queda sin margen térmico para procesar información, obligándote a reaccionar bajo supervivencia biológica.",
                video: "https://www.youtube.com/embed/SU_K-Qt4tf8",
                payment: "https://mpago.la/23c42on"
            },
            "Hiper Reactivo": {
                subtitle: "HIPER REACTIVIDAD",
                lead: "Te activas rápido. Sientes con intensidad abrumadora. Y muchísimas veces reaccionas antes de siquiera alcanzar la claridad.",
                definition: "Hiper Reactividad es cuando tu mente y tu cuerpo se activan como si tuvieras que defenderte de un gran peligro, aunque lo que esté sucediendo sea solo una conversación tensa, un tono alto, una señal ambigua o la simple presión de la rutina.",
                origin: "Con el estrés temprano continuo, la alta crítica, el perfeccionismo invalidante o el miedo crónico, el circuito vital del cerebro graba a fuego: 'me anticipo agresiva o defensivamente para estar a salvo'. Ese circuito se enciende velozmente en escenarios pacíficos.",
                video: "https://www.youtube.com/embed/Ke5JnAlBe7Y",
                payment: "https://mpago.la/2fyyjrJ"
            },
            "Inhibido": {
                subtitle: "INHIBIDO",
                lead: "Tu sistema prioriza biológicamente la desconexión para no sentir el peso emocional. Has optado, sin querer, por escudarte tras el aplanamiento, la procrastinación inactiva o simplemente apagar la máquina.",
                definition: "La Inhibición biológica es una respuesta natural pero extrema de conservación de energía. El cuerpo, al procesar que no tiene escapatoria física de la carga diaria que siente, decide 'ponerse en gris' para silenciar la sobrecarga.",
                origin: "Emerge cuando la idea intrínseca de lidiar con la presión y conflictos pasados es analizada como extenuante e inoportuna. Como último recurso, el cerebro desactiva la motivación y disminuye el afecto expresivo de forma radical.",
                video: "https://www.youtube.com/embed/liHSg0FOT9g",
                payment: "https://mpago.la/2TXMsQo"
            },
            "Sobre Adaptado": {
                subtitle: "SOBRE ADAPTADO",
                lead: "Te amoldas perfectamente a absolutamente todas las demandas y responsabilidades de otros, cumpliendo con gran éxito, pero ignorando crónicamente tus propias necesidades, cuerpo y límites.",
                definition: "Sobre-adaptación es seguir sosteniendo picos gigantes de estrés social o laboral utilizando excelentes recursos cognitivos de autoengaño, mientras silenciosamente dejas a tu cuerpo atrás, aplastando las señales que te exigen detenerte.",
                origin: "Este circuito premia en exceso tu eficacia por sobre tu equilibrio individual. Suele forjarse de un niño o joven adaptado a la creencia implícita de que la estima personal, el cariño, o la estabilidad se consolidan 'resolviéndole todo y no causándole problemas a nadie'.",
                video: "https://www.youtube.com/embed/8rIIp-15huw",
                payment: "https://mpago.la/1UCQXap"
            }
        };

        const matchProfileKey = results.perfil.split(" | ")[0].trim();
        const activeProfile = profileContent[matchProfileKey] || profileContent["Hiper Reactivo"];
        const phoneNumber = "56930179724";
        const wpMsg = `Hola, acabo de terminar mi test y mi perfil es ${encodeURIComponent(results.perfil)}. Quisiera solicitar más detalles y dar el siguiente paso.`;

        return (
            <div className="bg-[#f7fafc] min-h-screen text-[#0b1220] font-sans antialiased overflow-x-hidden">
                <style dangerouslySetInnerHTML={{
                    __html: `
                    :root {
                        --bg: #f7fafc;
                        --ink: #0b1220;
                        --muted: #415164;
                        --muted2: #6a7a8c;
                        --line: rgba(11,18,32,.10);
                        --card: #ffffff;
                        --shadow: 0 18px 55px rgba(14,26,38,.10);
                        --shadow2: 0 10px 26px rgba(14,26,38,.08);
                        --teal: #2aa6b8;
                        --navy: #0f1f33;
                        --accent: #e88b3a;
                        --ok: #10b981;
                        --radius: 22px;
                        --max: 1120px;
                        --font: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial;
                        --serif: ui-serif, Georgia, "Times New Roman", Times, serif;
                    }
                    .custom-container { max-width: var(--max); margin: 0 auto; padding: 0 20px; }
                    .topbar {
                        position: sticky; top: 0; z-index: 50;
                        background: rgba(255,255,255,.82);
                        backdrop-filter: blur(14px);
                        border-bottom: 1px solid var(--line);
                    }
                    .mark {
                        width: 38px; height: 38px; border-radius: 999px;
                        border: 2px solid rgba(42,166,184,.35);
                        box-shadow: 0 10px 24px rgba(14,26,38,.10);
                        background: radial-gradient(circle at 40% 40%, rgba(42,166,184,.18), transparent 55%);
                        position: relative;
                        overflow: hidden;
                    }
                    .mark:after {
                        content: "";
                        position: absolute; inset: 6px;
                        border-radius: 999px;
                        border: 2px solid rgba(42,166,184,.55);
                        border-left-color: transparent;
                        border-bottom-color: transparent;
                        transform: rotate(18deg);
                    }
                    .pill {
                        font-size: 12px;
                        text-decoration: none;
                        padding: 10px 12px;
                        border-radius: 999px;
                        border: 1px solid var(--line);
                        background: #fff;
                        color: var(--muted);
                        box-shadow: 0 4px 14px rgba(14,26,38,.06);
                        transition: .2s transform, .2s box-shadow;
                        white-space: nowrap;
                    }
                    .pill:hover { transform: translateY(-1px); box-shadow: 0 10px 22px rgba(14,26,38,.10); }
                    .pill.cta {
                        border: 0;
                        color: #fff;
                        background: var(--navy);
                        box-shadow: 0 14px 34px rgba(14,26,38,.16);
                        font-weight: 800;
                    }
                    .hero {
                        padding: 12px 0 18px;
                        position: relative;
                        overflow: hidden;
                        background: radial-gradient(900px 420px at 20% 0%, rgba(42,166,184,.14), transparent 60%), radial-gradient(900px 420px at 80% 0%, rgba(15,31,51,.10), transparent 60%);
                        border-bottom: 1px solid var(--line);
                    }
                    .hero-grid { display: grid; grid-template-columns: 1.1fr .9fr; gap: 18px; align-items: start; }
                    .result-chip {
                        display: inline-flex; align-items: center; gap: 10px;
                        padding: 10px 12px;
                        border-radius: 999px;
                        border: 1px solid var(--line);
                        background: #fff;
                        color: var(--muted);
                        font-size: 12px;
                        box-shadow: 0 10px 26px rgba(14,26,38,.08);
                    }
                    .badge-dot { width: 10px; height: 10px; border-radius: 999px; background: var(--accent); box-shadow: 0 0 0 6px rgba(232,139,58,.18); }
                    .h1-custom {
                        margin: 16px 0 10px;
                        font-size: 52px;
                        line-height: 1.03;
                        letter-spacing: -1px;
                        font-family: var(--serif);
                        font-weight: 600;
                        color: var(--navy);
                    }
                    .lead { margin: 0 0 14px; color: var(--muted); font-size: 17px; max-width: 62ch; }
                    .promise {
                        margin: 12px 0 16px;
                        padding: 12px 14px;
                        border-radius: 18px;
                        border: 1px solid rgba(42,166,184,.22);
                        background: rgba(42,166,184,.08);
                        color: #0f3a44;
                        font-weight: 750;
                        max-width: 64ch;
                    }
                    .btn-custom {
                        display: inline-flex; align-items: center; justify-content: center; gap: 10px;
                        padding: 13px 16px;
                        border-radius: 16px;
                        border: 1px solid var(--line);
                        background: #fff;
                        color: var(--navy);
                        text-decoration: none;
                        font-size: 14px;
                        font-weight: 850;
                        box-shadow: var(--shadow2);
                        transition: .2s transform, .2s box-shadow;
                    }
                    .btn-custom:hover { transform: translateY(-1px); box-shadow: 0 16px 38px rgba(14,26,38,.12); }
                    .btn-custom.primary {
                        border: 0;
                        color: #fff;
                        background: var(--navy);
                        box-shadow: 0 18px 44px rgba(14,26,38,.16);
                    }
                    .hint { margin-top: 14px; color: var(--muted2); font-size: 12px; display: flex; align-items: center; gap: 10px; }
                    .card-custom {
                        background: var(--card);
                        border: 1px solid var(--line);
                        border-radius: var(--radius);
                        box-shadow: var(--shadow);
                    }
                    .hero-card { padding: 18px; }
                    .micro {
                        margin-top: 10px;
                        padding-top: 12px;
                        border-top: 1px solid var(--line);
                        display: flex; gap: 10px; flex-wrap: wrap;
                        color: var(--muted2);
                        font-size: 12px;
                    }
                    .tag-custom { padding: 8px 10px; border-radius: 999px; border: 1px solid var(--line); background: #fff; box-shadow: 0 6px 16px rgba(14,26,38,.06); }
                    .section-custom { padding: 22px 0; }
                    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; align-items: start; }
                    .callout-custom {
                        border-radius: 16px;
                        padding: 12px 14px;
                        border: 1px solid rgba(232,139,58,.28);
                        background: rgba(232,139,58,.10);
                        color: #6a3f10;
                        font-size: 13px;
                    }
                    .value-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
                    .value { padding: 16px; border-radius: 18px; border: 1px solid rgba(11,18,32,.08); background: #fff; box-shadow: var(--shadow2); }
                    .value .icon {
                        width: 34px; height: 34px; border-radius: 14px;
                        display: flex; align-items: center; justify-content: center;
                        background: rgba(42,166,184,.10);
                        border: 1px solid rgba(42,166,184,.20);
                        margin-bottom: 10px;
                        font-weight: 900;
                        color: var(--teal);
                    }
                    .offer-box {
                        display: flex; align-items: flex-start; justify-content: space-between; gap: 14px; flex-wrap: wrap;
                        padding: 18px;
                        border-radius: var(--radius);
                        border: 1px solid rgba(11,18,32,.10);
                        background: linear-gradient(180deg, rgba(42,166,184,.08), rgba(255,255,255,1));
                        box-shadow: var(--shadow);
                    }
                    .price {
                        display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap;
                        padding: 10px 12px;
                        border-radius: 16px;
                        background: #fff;
                        border: 1px solid var(--line);
                        box-shadow: 0 8px 24px rgba(14,26,38,.08);
                    }
                    .guarantee {
                        display: flex; gap: 10px; align-items: flex-start;
                        padding: 12px 14px;
                        border-radius: 16px;
                        border: 1px solid rgba(16,185,129,.22);
                        background: rgba(16,185,129,.08);
                        color: #064e3b;
                        font-size: 13px;
                        max-width: 620px;
                    }
                    .sticky-cta {
                        position: fixed; left: 0; right: 0; bottom: 12px; z-index: 60;
                        padding: 0 12px;
                    }
                    @media (min-width: 921px) {
                        .sticky-cta { display: none; }
                    }
                    @media (max-width: 920px) {
                        .hero-grid { grid-template-columns: 1fr; }
                        .h1-custom { font-size: 40px; }
                        .grid-2 { grid-template-columns: 1fr; }
                        .value-grid { grid-template-columns: 1fr; }
                        .nav { display: none; }
                    }
                `}} />

                <section className="hero" id="top">
                    <div className="custom-container">
                        <div className="flex items-center justify-between gap-4 mb-10 bg-white/60 p-5 rounded-[22px] border border-[var(--line)] shadow-[var(--shadow2)] backdrop-blur-md">
                            <div className="flex items-center gap-4">
                                <Activity className="text-[var(--teal)] w-8 h-8" />
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-[var(--muted2)] font-bold mb-1">Datos Clínicos Anexos</p>
                                    <p className="text-sm font-medium text-[var(--navy)]">IDS-E: {results.IDSE} pts • {results.interpretacion.split('.')[0]}</p>
                                </div>
                            </div>
                            <div className="hidden md:block text-right">
                                <p className="text-[10px] uppercase tracking-widest text-[var(--muted2)] font-bold mb-1">Resumen dimensional</p>
                                <p className="text-xs font-medium text-[var(--navy)] max-w-sm">{results.resumenDimensional}</p>
                            </div>
                        </div>

                        {results.perfil === "Indeterminado" ? (
                            <div className="hero-grid mt-4" style={{ display: 'block', maxWidth: '600px', margin: '40px auto', textAlign: 'center' }}>
                                <div className="result-chip mb-6"><span className="badge-dot" style={{ background: '#6a7a8c', boxShadow: '0 0 0 6px rgba(106,122,140,.18)' }}></span> RESULTADO EN REVISIÓN</div>
                                <h1 className="h1-custom mb-4 leading-tight">Tu análisis está siendo procesado por el equipo clínico</h1>
                                <p className="lead mx-auto mb-8">Tus resultados requieren de un análisis más detallado, te contactaremos para entregarte tu resultado preciso.</p>
                                <a className="btn-custom primary text-base px-8 py-4 w-full justify-center" style={{ maxWidth: '320px', margin: '0 auto' }} href={`https://api.whatsapp.com/send/?phone=56930179724&text=Hola, acabo de terminar mi test y he recibido un resultado en revisión. Me gustaría saber más detalles.`} target="_blank" rel="noopener noreferrer">Contactar al equipo clínico</a>
                            </div>
                        ) : (
                            <div className="hero-grid mt-4">
                                <div>
                                    <div className="result-chip"><span className="badge-dot"></span> RESUMEN DEL DIAGNÓSTICO ESTADÍSTICO PARA {userInfo.name.split(' ')[0].toUpperCase()}</div>
                                    <h1 className="h1-custom">{activeProfile.subtitle}</h1>
                                    <p className="lead">{activeProfile.lead}</p>
                                    <div className="promise">
                                        <b>Cambia este resultado en tu vida</b> con un protocolo guiado de 30 días para reprogramar la respuesta biológica.
                                    </div>
                                    <div className="flex gap-[10px] flex-wrap items-center mt-6">
                                        <button className="btn-custom primary cursor-pointer" onClick={(e) => { e.preventDefault(); document.getElementById('transformar')?.scrollIntoView({ behavior: 'smooth' }); }}>Avanzar e Ingresar al Programa (↓)</button>
                                        <button className="btn-custom cursor-pointer" onClick={(e) => { e.preventDefault(); document.getElementById('video')?.scrollIntoView({ behavior: 'smooth' }); }}>Ver video de tu diagnóstico (2 min)</button>
                                    </div>
                                    <div className="hint mt-8">
                                        <div className="w-[32px] h-[32px] rounded-full border border-[var(--line)] bg-white flex items-center justify-center shadow-[var(--shadow2)] text-lg">↓</div>
                                        <span className="text-sm">Desliza para entender el patrón y ver tu evaluación detallada.</span>
                                    </div>
                                </div>
                                <aside className="card-custom hero-card" aria-label="Validación rápida">
                                    <b className="block text-[12px] text-[var(--muted2)] tracking-[.14em] uppercase mb-[10px]">Lo principal de tu resultado</b>
                                    <h3 className="m-0 mb-[10px] text-[18px] text-[var(--navy)] font-serif">Esta no es tu "Personalidad".</h3>
                                    <ul className="m-0 pl-[18px] text-[var(--muted)] text-[14px]">
                                        <li className="my-[8px]">Al somatizar de esta forma nos indica un <b>circuito aprendido</b> del sistema nervioso intentando protegerte de la carga acumulada.</li>
                                        <li className="my-[8px]">Puede estar activándose incluso cuando no hay ni peligro ni tensión aparente frente a ti (ansiedad flotante).</li>
                                        <li className="my-[8px]">Toda esta sensación puede entrenarse para recuperar el control utilizando neuroplasticidad comprobada.</li>
                                    </ul>
                                    <div className="micro">
                                        <div className="tag-custom">Análisis de Reacciones</div>
                                        <div className="tag-custom">Medición Clínica Real</div>
                                        <div className="tag-custom">Ruta Terapéutica</div>
                                    </div>
                                </aside>
                            </div>
                        )}
                    </div>
                </section>

                {results.perfil !== "Indeterminado" && (
                    <>
                        <section className="section-custom" id="transformar">
                            <div className="custom-container grid-2">
                                <div className="card-custom p-[22px]">
                                    <h2 className="m-0 mb-[12px] text-[24px] tracking-[-.2px] text-[var(--navy)] font-serif">Qué significa a nivel neurobiológico</h2>
                                    <p className="m-0 mb-[16px] text-[var(--muted)] leading-relaxed">{activeProfile.definition}</p>
                                    <div className="callout-custom">El objetivo del tratamiento no es anular tus capacidades, sino restaurar un equilibrio sólido y devolverte tu salud orgánica para no depender farmacológicamente.</div>
                                </div>
                                <div className="card-custom p-[22px]">
                                    <h2 className="m-0 mb-[12px] text-[24px] tracking-[-.2px] text-[var(--navy)] font-serif">Por qué se sostiene el {activeProfile.subtitle} en ti</h2>
                                    <p className="m-0 mb-[16px] text-[var(--muted)] leading-relaxed" dangerouslySetInnerHTML={{ __html: activeProfile.origin.replace(/'([^']+)'/g, "<b>'$1'</b>") }}></p>
                                    <p className="m-0 mb-[4px] text-[12px] uppercase font-bold text-[var(--teal)]">SÍNTESIS ESPECÍFICA DE TUS VARIABLES:</p>
                                    <p className="m-0 text-[14px] text-[var(--navy)]">{results.interrelacion} ({results.ITA} de carga frente a {results.Re} de recursos)</p>
                                </div>
                            </div>
                        </section>

                        <section className="section-custom" id="video">
                            <div className="custom-container">
                                <div className="card-custom p-[24px]">
                                    <h2 className="m-0 mb-[10px] text-[26px] tracking-[-.2px] text-[var(--navy)] font-serif text-center">Entiende tu diagnóstico con este video detallado</h2>
                                    <p className="m-0 mb-[24px] text-[var(--muted)] text-center max-w-2xl mx-auto">Reproduce tu sesión para entender exactamente cómo tu cerebro aprendió este mecanismo y por qué nuestra reprogramación clínica apunta al origen del problema.</p>
                                    <div className="max-w-4xl mx-auto aspect-video rounded-[22px] overflow-hidden border border-[rgba(11,18,32,.12)] shadow-xl bg-black relative">
                                        <iframe src={activeProfile.video} title={`Video perfil ${activeProfile.subtitle}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen className="w-full h-full border-0 absolute top-0 left-0"></iframe>
                                    </div>
                                    <div className="flex gap-[16px] flex-wrap items-center justify-center mt-[24px]">
                                        <a className="btn-custom primary text-base px-8 py-4" href={activeProfile.payment} target="_blank" rel="noopener noreferrer">Proceder a la Solución de 30 días</a>
                                        <a className="btn-custom text-base px-8 py-4" href={`https://api.whatsapp.com/send/?phone=${phoneNumber}&text=${wpMsg}`} target="_blank" rel="noopener noreferrer">Ver contenido de la solución paso a paso</a>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="section-custom bg-white/40" id="incluye">
                            <div className="custom-container">
                                <div className="card-custom p-[24px] md:p-[32px]">
                                    <h2 className="m-0 mb-[10px] text-[28px] tracking-[-.2px] text-[var(--navy)] font-serif">Cómo transicionarlo (Protocolo RFAI • 30 días)</h2>
                                    <p className="m-0 mb-[24px] text-[var(--muted)] text-[16px] max-w-3xl">Un protocolo estricto clínico-práctico totalmente fundado en tu neuroplasticidad para reorganizar tu respuesta inconsciente. El programa no intentará forzar tu memoria, <b>te guiará para asentar respuestas biológicas de paz interior duradera</b>.</p>

                                    <div className="value-grid">
                                        <div className="value hover:-translate-y-1 transition-transform">
                                            <div className="icon">1</div>
                                            <b className="block mb-[6px] text-[var(--navy)] text-base">Auditoría Inmersiva Inicial</b>
                                            <p className="m-0 text-[var(--muted)] text-[14px]">Sesión exclusiva donde evaluamos tu estado base, marcaciones y gatillantes emocionales para trazar tu viaje.</p>
                                        </div>
                                        <div className="value hover:-translate-y-1 transition-transform">
                                            <div className="icon">2</div>
                                            <b className="block mb-[6px] text-[var(--navy)] text-base">Hipnosis Clínica Especializada</b>
                                            <p className="m-0 text-[var(--muted)] text-[14px]">Audios y sugestión subliminal para acceder a capas profundas y reescribir progresivamente tu exigencia metabólica.</p>
                                        </div>
                                        <div className="value hover:-translate-y-1 transition-transform">
                                            <div className="icon">3</div>
                                            <b className="block mb-[6px] text-[var(--navy)] text-base">Trackeo e-Integrativo</b>
                                            <p className="m-0 text-[var(--muted)] text-[14px]">Cuestionarios o cuadernos semanales donde medimos empíricamente cómo el cambio está asentándose en ti.</p>
                                        </div>
                                        <div className="value hover:-translate-y-1 transition-transform">
                                            <div className="icon">4</div>
                                            <b className="block mb-[6px] text-[var(--navy)] text-base">Acompañamiento Permanente</b>
                                            <p className="m-0 text-[var(--muted)] text-[14px]">Anotaciones y revisiones periódicas que validan que la reprogramación neuronal no sea por azar, sino un hábito.</p>
                                        </div>
                                        <div className="value hover:-translate-y-1 transition-transform">
                                            <div className="icon">5</div>
                                            <b className="block mb-[6px] text-[var(--navy)] text-base">Auditoría Psíquica de Cierre</b>
                                            <p className="m-0 text-[var(--muted)] text-[14px]">Test Final y Evaluación para observar y confirmar tu nuevo balance interno de variables y resultados consolidables.</p>
                                        </div>
                                        <div className="value hover:-translate-y-1 transition-transform">
                                            <div className="icon">+</div>
                                            <b className="block mb-[6px] text-[var(--navy)] text-base">Audios de Blindaje (SOS)</b>
                                            <p className="m-0 text-[var(--muted)] text-[14px]">Kit de moduladores extra para situaciones sorpresivas de alta sobrecarga emocional y resiliencia a largo plazo.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="section-custom mb-20" id="comprar">
                            <div className="custom-container">
                                <div className="offer-box p-[24px] md:p-[32px]">
                                    <div className="max-w-xl">
                                        <h2 className="m-0 mb-[12px] text-[32px] md:text-[40px] tracking-[-1px] text-[var(--navy)] font-serif leading-tight">Cambia todo el enfoque de tu vida en los próximos 30 días</h2>
                                        <p className="m-0 mb-[24px] text-[var(--muted)] text-base">
                                            Si comprendes de dónde viene tu desgaste pero pareces seguir reaccionando en automático con miedo o desgaste cada día, nuestro protocolo clínico integral (RFAI) modificará esta inercia protegiendo tu salud.
                                        </p>
                                        <div className="guarantee">
                                            <div className="font-black text-xl">✔</div>
                                            <div className="text-base">
                                                <b>Proceso guiado, no material en frío</b>. Obtienes intervenciones de hipnosis real y revisiones de equipo, una garantía para una transformación verificable.
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full md:w-auto mt-8 md:mt-0 md:min-w-[320px]">
                                        <div className="price mb-2">
                                            <div className="text-[36px] md:text-[48px] font-black text-[var(--navy)] tracking-tighter">$290.000</div>
                                        </div>
                                        <div className="text-[13px] text-[var(--muted2)] mb-8 font-medium">Tarifa única total por lanzamiento del Método Integro Completo</div>
                                        <div className="flex flex-col gap-[16px]">
                                            <a className="btn-custom primary text-lg py-5 shadow-[0_22px_50px_rgba(14,26,38,.20)] hover:-translate-y-1" href={activeProfile.payment} target="_blank" rel="noopener noreferrer">🛒 COMPRAR ACCESO ONLINE AHORA</a>
                                            <a className="btn-custom border-2 border-[#25D366] text-[#128C7E] text-base py-4 hover:bg-[#25D366] hover:text-white" href={`https://api.whatsapp.com/send/?phone=${phoneNumber}&text=${wpMsg}`} target="_blank" rel="noopener noreferrer">📲 Consultar dudas por WhatsApp</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </>
                )}

                <footer className="pt-[32px] pb-[90px] md:pb-[70px] border-t border-[var(--line)] text-[var(--muted2)] text-[12px] md:text-[14px]">
                    <div className="custom-container text-center text-slate-400">
                        © Centro Clínico Equilibrar • RFAI — Reprogramación Focalizada de Alto Impacto • Enfoque Clínico Especializado.<br />La información arrojada y expuesta en este sitio es informativa y no reemplaza diagnóstico médico oficial.
                    </div>
                </footer>

                {results.perfil !== "Indeterminado" && (
                    <div className="sticky-cta">
                        <div className="max-w-[1120px] mx-auto bg-[rgba(255,255,255,.9)] backdrop-blur-[16px] border border-[var(--line)] rounded-[20px] shadow-[0_-10px_40px_rgba(14,26,38,.12)] p-[12px] flex items-center justify-between gap-[12px]">
                            <div>
                                <b className="text-[14px] text-[var(--navy)] font-bold">Resultado: {activeProfile.subtitle}</b>
                                <span className="block text-[12px] text-[var(--muted2)] font-medium">Tratamiento Clínico RFAI 30 días</span>
                            </div>
                            <a className="btn-custom primary py-[12px] px-[20px] rounded-[16px] text-sm" href={activeProfile.payment} target="_blank" rel="noopener noreferrer">Comprar Ahora ($290k)</a>
                        </div>
                    </div>
                )}

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
                            <h2 className="text-3xl md:text-4xl font-serif text-brand-heading mb-4">Bienvenido al test de autopercepción de equilibrio interno</h2>
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
