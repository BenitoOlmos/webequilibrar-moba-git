import React, { useState, useEffect } from 'react';
import { Activity, Brain, HeartPulse, UserCircle2, ArrowRight, ShieldCheck, ArrowLeft, CheckCircle2, BarChart3, PlayCircle } from 'lucide-react';
import { profilesData } from '../data/testRFAIProfiles';
import logoImg from '../assets/images/logo-clinica-equilibrar.png';

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

        // 1. Variables del test
        const F = sumRange(0, 7); // Activación Fisiológica (AF)
        const C = sumRange(7, 14); // Activación Cognitiva (AM)
        const E = sumRange(14, 21); // Activación Emocional (AE)
        const pureR = sumRange(21, 28); // Regulación Base

        // 3. Cálculo de activación global y Regulación
        const R_total = pureR * 3; // Regulación Total (0-84)
        const A = C + E + F; // Activación global (0-84)

        // 4. Coherencia entre sistemas
        const D = Math.max(C, E, F) - Math.min(C, E, F);

        let perfil = "Indeterminado"; // Por defecto, asume requerir evaluación
        let requiresProfessional = false;

        // 7. Reglas de derivación (D >= 9 es Incoherencia)
        if (D >= 9) {
            requiresProfessional = true;
        }

        // 5 & 6. Reglas de clasificación
        if (!requiresProfessional) {
            // Perfil Inhibido
            if (A <= 27 && R_total <= 54 && D <= 8) {
                perfil = "Inhibido";
            }
            // Perfil Hiperreactivo
            else if (A >= 55 && R_total <= 27 && (E >= 19 || F >= 19) && D <= 8) {
                if (E <= 9) requiresProfessional = true; // Excepción
                else perfil = "Hiper Reactivo";
            }
            // Perfil Hiperregulado
            else if (C >= 19 && R_total >= 55 && E <= 18 && A >= 28 && D <= 8) {
                if (F >= 19 && E <= 9) requiresProfessional = true; // Excepción
                else perfil = "Hiper Regulado";
            }
            // Perfil Sobre Adaptado
            else if (R_total >= 55 && A >= 28 && A <= 54 && C >= 10 && C <= 18 && E >= 10 && E <= 18 && F >= 10 && F <= 18 && D <= 8) {
                perfil = "Sobre Adaptado";
            }
            // Perfil Desregulado (Visualmente mapeado al dict como 'Desbordado')
            else if (
                ((A >= 55 && R_total >= 28 && R_total <= 54 && D <= 8) ||
                    (A >= 28 && A <= 54 && R_total <= 27 && D <= 8))
            ) {
                perfil = "Desbordado";
            } else {
                requiresProfessional = true; // No cumple criterios estrictos de ninguno
            }
        }

        if (requiresProfessional) {
            perfil = "Indeterminado";
        }

        if (perfil === "Indeterminado") {
            console.warn("RFAI requiere evaluación profesional", { C, E, F, R_total, A, D });
        }

        // Mapeo legacy para interrelaciones y componentes visuales previas
        const AF = F;
        const AM = C;
        const AE = E;
        const R = pureR;
        const ITA = A;
        const Re = R_total;
        const IDSE = ITA - Re;

        let interpretacion = "";
        if (IDSE <= -20) interpretacion = "Regulación robusta. Excedente de recursos que facilita resiliencia y salud.";
        else if (IDSE >= -19 && IDSE <= 19) interpretacion = "Balance funcional. Relación proporcionada entre demandas internas y capacidad de modulación.";
        else if (IDSE >= 20 && IDSE <= 49) interpretacion = "Desbalance moderado. Consumo excesivo de recursos por sobre-activación de las bases biológicas.";
        else interpretacion = "Desbalance alto. Consumo excesivo prolongado que puede llevar a síndromes tensionales, disregulación anímica o agotamiento funcional.";

        let interrelacion = "Perfil de Estabilidad Funcional.";
        if (AF <= 9 && AM <= 9 && AE <= 9) {
            interrelacion = "Estado depresivo / Inhibido.";
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
            interrelacion = "Balance funcional sin diferencias marcadas.";
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

        const level3CEF = (score: number) => {
            if (score <= 9) return "Bajo";
            if (score <= 18) return "Medio";
            return "Alto";
        };

        const level3R = (rTotalValue: number) => {
            if (rTotalValue <= 27) return "Baja";
            if (rTotalValue <= 54) return "Media";
            return "Alta";
        };

        // 8. Información que siempre debe mostrarse al usuario
        const resumenDimensional = `Resultado Cognitivo: ${level3CEF(C)} · Resultado Emocional: ${level3CEF(E)} · Resultado Fisiológico: ${level3CEF(F)} · Resultado de Regulación: ${level3R(R_total)}`;

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


    if (showResults && results) {
        const matchProfileKey = results.perfil.split(" | ")[0].trim();
        const activeProfile = profilesData[matchProfileKey] || profilesData["Indeterminado"];
        const isReview = matchProfileKey === "Indeterminado";

        const getLevel = (val: number, isReg: boolean) => {
            if (isReg) {
                if (val <= 27) return { text: 'Baja', cls: 'is-low' };
                if (val <= 54) return { text: 'Media', cls: 'is-medium' };
                return { text: 'Alta', cls: 'is-high' };
            }
            if (val <= 9) return { text: 'Bajo', cls: 'is-low' };
            if (val <= 18) return { text: 'Medio', cls: 'is-medium' };
            return { text: 'Alto', cls: 'is-high' };
        };

        const lvlE = getLevel(results.AE, false);
        const lvlR = getLevel(results.AM, false);
        const lvlF = getLevel(results.AF, false);
        const lvlReg = getLevel(results.Re, true);

        if (isReview) {
            return (
                <div className="bg-[#F6FAFF] min-h-screen text-[#0B1220] font-sans antialiased overflow-x-hidden" style={{ background: 'radial-gradient(1200px 420px at 50% 0%,#EAF4FF 0%, #F6FAFF 60%)', lineHeight: 1.45 }}>
                    <style dangerouslySetInnerHTML={{
                        __html: `
                        :root{--bg:#F6FAFF;--card:#FFFFFF;--text:#0B1220;--muted:#52607A;--line:#E5ECF6;--primary:#0F2A4A;--accent:#2D7EF7;--ok:#E9FFF3;--okLine:#BFEFD3;--warn:#FFF6E6;--warnLine:#F2D3A0;--radius:18px;--radius2:22px;--shadow:0 12px 30px rgba(15,42,74,.10);--max:1100px}
                        .container{width:min(var(--max),calc(100% - 40px));margin:auto}
                        .card{background:var(--card);border:1px solid var(--line);border-radius:var(--radius2);box-shadow:var(--shadow)}
                        .muted{color:var(--muted)}
                        .topbar{border-bottom:1px solid var(--line);background:rgba(246,250,255,.8);position:sticky;top:0;z-index:50;backdrop-filter:blur(8px)}
                        .nav-review{display:flex;align-items:center;justify-content:space-between;padding:14px 0}
                        .logo{width:40px;height:40px;border-radius:999px;background:conic-gradient(from 180deg,#7CC4FF,#2D7EF7,#6BE6C9,#7CC4FF)}
                        .brand{display:flex;gap:10px;align-items:center;font-weight:700}
                        .btn{padding:12px 16px;border-radius:14px;font-weight:700;font-size:13px;cursor:pointer;border:1px solid transparent;display:inline-flex;align-items:center;gap:8px;text-decoration:none}
                        .btn-primary{background:linear-gradient(180deg,#1B4D7A,#0F2A4A);color:#fff;box-shadow:0 8px 20px rgba(15,42,74,.20)}
                        .btn-ghost{border:1px solid var(--line);background:#fff;color:var(--primary)}
                        .hero-review{padding:40px 0 20px}
                        .grid-review{display:grid;grid-template-columns:1.1fr .9fr;gap:20px;margin-top:20px;align-items:start}
                        @media(max-width:900px){.grid-review{grid-template-columns:1fr}}
                        .kicker{font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);font-weight:bold}
                        .h1-review{font-size:clamp(36px, 5vw, 48px);margin:8px 0 12px;letter-spacing:-1px;line-height:1.1;font-weight:800;color:var(--text)}
                        .lead-review{color:var(--muted);font-size:18px;max-width:54ch}
                        .note{margin-top:24px;padding:18px;border-radius:var(--radius);border:1px solid var(--warnLine);background:linear-gradient(180deg,#fff,var(--warn))}
                        .right{padding:24px}
                        .right h3{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);margin-bottom:12px;margin-top:0}
                        .list{display:grid;gap:12px;margin-top:10px}
                        .li{border:1px solid var(--line);border-radius:14px;padding:16px;background:#fff}
                        .section-review{padding:40px 0}
                        .section-title{font-size:28px;margin:0 0 12px;letter-spacing:-.5px;color:var(--primary)}
                        .steps{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:24px}
                        @media(max-width:900px){.steps{grid-template-columns:1fr}}
                        .step{padding:20px;border-radius:16px;border:1px solid var(--line);background:#fff;box-shadow:0 4px 12px rgba(15,42,74,.04)}
                        .badge{width:32px;height:32px;border-radius:10px;background:#EAF2FF;color:var(--accent);display:flex;align-items:center;justify-content:center;font-weight:800;margin-bottom:12px}
                        .wa{padding:30px;border-radius:var(--radius2);border:1px solid var(--okLine);background:linear-gradient(180deg,#fff,var(--ok));display:flex;justify-content:space-between;align-items:center;gap:20px;flex-wrap:wrap;box-shadow:0 12px 30px rgba(16,185,129,.10)}
                        footer.review-footer{padding:30px 0;font-size:13px;color:var(--muted);text-align:center;border-top:1px solid var(--line)}
                        `
                    }} />

                    <div className="topbar">
                        <div className="container">
                            <div className="nav-review">
                                <div className="brand">
                                    <div className="logo"></div>
                                    <div>Equilibrar</div>
                                </div>
                                <button onClick={(e) => { e.preventDefault(); document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" }); }} className="btn btn-primary">Contactar</button>
                            </div>
                        </div>
                    </div>

                    <header className="hero-review" id="top">
                        <div className="container">
                            <p className="kicker">Resultado del Test</p>
                            <h1 className="h1-review">Tu resultado requiere revisión de especialista</h1>
                            <p className="lead-review">
                                En algunos casos, los puntajes no encajan completamente en una sola categoría. Esto no significa que haya algo incorrecto. Significa que tu patrón necesita una lectura más profunda para entregarte un resultado preciso.
                            </p>
                            <div className="note">
                                <strong style={{ color: 'var(--primary)' }}>Qué ocurrirá ahora:</strong><br />
                                Un especialista revisará tu resultado y te contactaremos dentro de <strong>48 horas</strong> con una lectura más detallada.
                            </div>
                        </div>
                    </header>

                    <section className="section-review">
                        <div className="container grid-review">
                            <div>
                                <h2 className="section-title">Qué significa esto</h2>
                                <p className="muted" style={{ fontSize: '16px', maxWidth: '50ch' }}>
                                    A veces los resultados muestran combinaciones entre distintas dimensiones de activación y regulación. En estos casos, el análisis automático no es suficiente y es necesario realizar una revisión clínica breve.
                                </p>
                            </div>
                            <aside className="card right">
                                <h3>Qué puedes esperar</h3>
                                <div className="list">
                                    <div className="li">
                                        <strong style={{ display: 'block', marginBottom: '4px', color: 'var(--primary)' }}>Lectura más precisa</strong>
                                        <div className="muted" style={{ fontSize: '14px' }}>Identificamos si tu patrón corresponde a un perfil mixto.</div>
                                    </div>
                                    <div className="li">
                                        <strong style={{ display: 'block', marginBottom: '4px', color: 'var(--primary)' }}>Explicación clara</strong>
                                        <div className="muted" style={{ fontSize: '14px' }}>Te devolvemos el resultado en un lenguaje comprensible.</div>
                                    </div>
                                    <div className="li">
                                        <strong style={{ display: 'block', marginBottom: '4px', color: 'var(--primary)' }}>Orientación</strong>
                                        <div className="muted" style={{ fontSize: '14px' }}>Si corresponde, te indicamos el mejor siguiente paso.</div>
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </section>

                    <section className="section-review">
                        <div className="container">
                            <h2 className="section-title">Qué pasará ahora</h2>
                            <div className="steps">
                                <div className="step">
                                    <div className="badge">1</div>
                                    <strong style={{ display: 'block', marginBottom: '6px', color: 'var(--primary)' }}>Revisión clínica</strong>
                                    <p className="muted" style={{ margin: 0, fontSize: '14px' }}>Un especialista revisa tus puntajes y sus interacciones.</p>
                                </div>
                                <div className="step">
                                    <div className="badge">2</div>
                                    <strong style={{ display: 'block', marginBottom: '6px', color: 'var(--primary)' }}>Definición del perfil</strong>
                                    <p className="muted" style={{ margin: 0, fontSize: '14px' }}>Se identifica el patrón dominante o perfil mixto.</p>
                                </div>
                                <div className="step">
                                    <div className="badge">3</div>
                                    <strong style={{ display: 'block', marginBottom: '6px', color: 'var(--primary)' }}>Contacto en 48 horas</strong>
                                    <p className="muted" style={{ margin: 0, fontSize: '14px' }}>Te escribimos con tu resultado preciso.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="section-review" id="contacto" style={{ marginBottom: '40px' }}>
                        <div className="container">
                            <div className="wa">
                                <div>
                                    <h2 style={{ margin: '0 0 8px', fontSize: '24px', color: '#047857', letterSpacing: '-.5px' }}>¿Prefieres escribirnos ahora?</h2>
                                    <p className="muted" style={{ margin: 0, fontSize: '15px', maxWidth: '400px' }}>
                                        Puedes contactarnos por WhatsApp si te resulta más cómodo. Responderemos lo antes posible.
                                    </p>
                                </div>
                                <a className="btn btn-primary" style={{ background: '#10b981', boxShadow: '0 8px 24px rgba(16,185,129,.3)' }} href="https://api.whatsapp.com/send/?phone=56930179724&text=Hola,%20hice%20el%20test%20y%20mi%20resultado%20requiere%20revisión%20especialista.%20¿Me%20pueden%20contactar?" target="_blank" rel="noopener noreferrer">
                                    Abrir WhatsApp
                                </a>
                            </div>
                        </div>
                    </section>

                    <footer className="review-footer">
                        <div className="container">
                            © 2026 Centro Clínico Equilibrar
                        </div>
                    </footer>
                </div>
            );
        }

        return (
            <div className="bg-[#F6FAFF] min-h-screen text-[#0B1220] font-sans antialiased overflow-x-hidden">
                <style dangerouslySetInnerHTML={{
                    __html: `
                    :root{
                      --bg: #F6FAFF;
                      --card: #FFFFFF;
                      --text: #0B1220;
                      --muted: #52607A;
                      --line: #E5ECF6;
                      --primary: #0F2A4A;
                      --primary2: #1B4D7A;
                      --accent: #2D7EF7;
                      --soft: #EAF2FF;
                      --ok: #E9FFF3;
                      --okLine:#BFEFD3;
                      --shadow: 0 12px 30px rgba(15,42,74,.10);
                      --radius: 18px;
                      --radius2: 22px;
                      --max: 1120px;
                    }
                    .custom-container{max-width:var(--max);margin:0 auto;padding:0 20px}
                    .topbar{position:sticky;top:0;z-index:50;background:rgba(255,255,255,.85);backdrop-filter:blur(16px);border-bottom:1px solid var(--line)}
                    .mark{width:34px;height:34px;border-radius:99px;background:var(--primary);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:900;font-size:16px;letter-spacing:-1px}
                    .pill{font-size:13px;font-weight:600;text-decoration:none;padding:10px 16px;border-radius:99px;border:1px solid var(--line);background:#fff;color:var(--text);transition:.2s}
                    .pill:hover{background:var(--bg);transform:translateY(-1px)}
                    .pill.cta{background:var(--primary);color:#fff;border:0;box-shadow:0 8px 20px rgba(15,42,74,.20)}
                    
                    .hero{padding:20px 0 40px;position:relative}
                    .hero-grid{display:grid;grid-template-columns:1.2fr .8fr;gap:24px;align-items:start}
                    
                    .result-chip{display:inline-flex;align-items:center;gap:10px;padding:8px 14px;border-radius:99px;background:var(--card);border:1px solid var(--line);font-size:12px;font-weight:700;letter-spacing:1px;color:var(--muted);box-shadow:var(--shadow)}
                    @keyframes pulse{0%{box-shadow:0 0 0 0 rgba(45,126,247,.4)}70%{box-shadow:0 0 0 8px rgba(45,126,247,0)}100%{box-shadow:0 0 0 0 rgba(45,126,247,0)}}
                    .badge-dot{width:10px;height:10px;border-radius:99px;background:var(--accent);animation:pulse 2s infinite}
                    .h1-custom{margin:20px 0 16px;font-size:clamp(40px, 5vw, 64px);line-height:1;letter-spacing:-2px;font-weight:800;color:var(--text)}
                    .lead{margin:0 0 24px;color:var(--muted);font-size:18px;line-height:1.6;max-width:54ch}
                    
                    .promise-box{padding:18px 22px;border-radius:var(--radius);background:#fff;border:1px solid var(--line);border-left:4px solid var(--accent);box-shadow:var(--shadow);font-size:15px;color:var(--text);line-height:1.5;max-width:54ch}
                    
                    .btn-custom{display:inline-flex;align-items:center;justify-content:center;gap:10px;padding:16px 24px;border-radius:16px;font-size:15px;font-weight:700;text-decoration:none;transition:.2s;cursor:pointer;border:none}
                    .btn-primary{background:var(--primary);color:#fff;box-shadow:0 12px 30px rgba(15,42,74,.25)}
                    .btn-primary:hover{transform:translateY(-2px);box-shadow:0 16px 40px rgba(15,42,74,.30);background:var(--primary2)}
                    .btn-outline{background:#fff;border:1px solid var(--line);color:var(--text);box-shadow:0 4px 12px rgba(15,42,74,.05)}
                    .btn-outline:hover{background:var(--bg)}
                    
                    aside{background:#fff;border-radius:var(--radius2);padding:24px;border:1px solid var(--line);box-shadow:var(--shadow)}
                    .data-row{display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid var(--line)}
                    .data-row:last-child{border-bottom:0;padding-bottom:0}
                    .data-label{font-size:13px;font-weight:600;color:var(--muted)}
                    .data-value{font-size:14px;font-weight:700;padding:4px 12px;border-radius:8px}
                    .is-high{background:rgba(239,68,68,.1);color:#B91C1C} /* red */
                    .is-medium{background:rgba(245,158,11,.1);color:#B45309} /* orange */
                    .is-low{background:rgba(16,185,129,.1);color:#047857} /* green */
                    
                    .section-custom{padding:60px 0}
                    .grid-2{display:grid;grid-template-columns:1fr 1fr;gap:20px}
                    
                    .card-custom{background:#fff;border-radius:var(--radius);padding:32px;border:1px solid var(--line);box-shadow:var(--shadow)}
                    .h2-custom{margin:0 0 16px;font-size:28px;letter-spacing:-1px;font-weight:800;color:var(--primary)}
                    
                    .quote-box{padding:16px;border-radius:12px;background:var(--bg);margin-bottom:12px;font-size:15px;color:var(--text);font-style:italic;border-left:3px solid var(--line)}
                    .quote-who{display:block;margin-top:8px;font-size:12px;font-weight:700;color:var(--muted);font-style:normal;text-transform:uppercase;letter-spacing:1px}
                    
                    .video-wrapper{aspect-ratio:16/9;background:#000;border-radius:var(--radius);overflow:hidden;box-shadow:var(--shadow);position:relative;margin:0 auto 24px;max-width:800px}
                    .video-wrapper iframe{width:100%;height:100%;border:0;position:absolute;top:0;left:0}
                    
                    .step-list{list-style:none;padding:0;margin:0}
                    .step-item{display:flex;gap:16px;margin-bottom:24px}
                    .step-num{width:32px;height:32px;flex-shrink:0;border-radius:99px;background:var(--soft);color:var(--accent);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:14px}
                    .step-text{font-size:15px;color:var(--text);line-height:1.5;margin-top:5px}
                    
                    .price-box{background:#fff;border:2px solid var(--okLine);border-radius:var(--radius2);padding:40px;text-align:center;box-shadow:var(--shadow);max-width:500px;margin:0 auto}
                    
                    @media(max-width:900px){
                      .hero-grid{grid-template-columns:1fr}
                      .grid-2{grid-template-columns:1fr}
                      .nav{display:none}
                      .section-custom{padding:40px 0}
                    }
                    `
                }} />

                <nav className="topbar">
                    <div className="custom-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBlock: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div className="mark">E</div>
                            <b style={{ fontSize: '15px', color: 'var(--navy)', letterSpacing: '-.3px' }}>RFAI · Análisis de Resultados</b>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }} className="nav">
                            <button onClick={(e) => { e.preventDefault(); document.getElementById("patron")?.scrollIntoView({ behavior: "smooth" }); }} className="pill">Entender este patrón</button>
                            <button onClick={(e) => { e.preventDefault(); document.getElementById("Checkout")?.scrollIntoView({ behavior: "smooth" }); }} className="pill cta">{isReview ? "Contactar al equipo" : "Iniciar Recuperación"}</button>
                        </div>
                    </div>
                </nav>

                <section className="hero" id="top">
                    <div className="custom-container hero-grid">
                        <div>
                            <div className="result-chip">
                                <span className="badge-dot" style={{ background: isReview ? '#6a7a8c' : 'var(--accent)' }}></span>
                                {isReview ? "RESULTADO EN REVISIÓN" : "RESULTADO DEL ANÁLISIS ESTADÍSTICO"}
                            </div>

                            <h1 className="h1-custom">{activeProfile.title}</h1>

                            <p className="lead" dangerouslySetInnerHTML={{ __html: activeProfile.lead }} />

                            <div className="promise-box" dangerouslySetInnerHTML={{ __html: activeProfile.promise }} />

                            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '32px' }}>
                                <button onClick={(e) => { e.preventDefault(); document.getElementById("video")?.scrollIntoView({ behavior: "smooth" }); }} className="btn-custom btn-primary">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                                    Ver explicación en video
                                </button>
                                <button onClick={(e) => { e.preventDefault(); document.getElementById("patron")?.scrollIntoView({ behavior: "smooth" }); }} className="btn-custom btn-outline">Leer reporte completo ↓</button>
                            </div>
                        </div>

                        <aside>
                            <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--muted)', letterSpacing: '1px', marginBottom: '16px' }}>RESUMEN DIMENSIONAL</div>

                            <div className="data-row">
                                <span className="data-label">Activación Emocional</span>
                                <span className={`data-value ${lvlE.cls}`}>{lvlE.text}</span>
                            </div>
                            <div className="data-row">
                                <span className="data-label">Activación Racional</span>
                                <span className={`data-value ${lvlR.cls}`}>{lvlR.text}</span>
                            </div>
                            <div className="data-row">
                                <span className="data-label">Activación Fisiológica</span>
                                <span className={`data-value ${lvlF.cls}`}>{lvlF.text}</span>
                            </div>
                            <div className="data-row" style={{ marginTop: '12px', paddingTop: '12px', borderTop: '2px dashed var(--line)' }}>
                                <span className="data-label" style={{ color: 'var(--primary)' }}>Capacidad de Regulación</span>
                                <span className={`data-value ${lvlReg.cls}`}>{lvlReg.text}</span>
                            </div>

                            <div style={{ marginTop: '24px', padding: '16px', borderRadius: '12px', background: 'var(--soft)', fontSize: '13px', color: 'var(--primary)', lineHeight: 1.5 }}>
                                <strong style={{ display: 'block', marginBottom: '4px' }}>Diagnóstico de interrelación:</strong>
                                {results.interrelacion}
                            </div>
                        </aside>
                    </div>
                </section>

                <section className="section-custom" id="patron" style={{ background: '#fff' }}>
                    <div className="custom-container grid-2">
                        <div>
                            <h2 className="h2-custom">Cómo se vive este patrón en el día a día</h2>
                            <p style={{ color: 'var(--muted)', fontSize: '16px', lineHeight: 1.6, marginBottom: '24px' }}>
                                Las personas con este perfil suelen reportar experiencias muy similares. No estás solo/a en esta forma de respuesta.
                            </p>
                            {activeProfile.quotes.map((quote, idx) => (
                                <div key={idx} className="quote-box">
                                    {quote.text}
                                    <span className="quote-who">{quote.who}</span>
                                </div>
                            ))}
                        </div>
                        <div className="card-custom" style={{ boxShadow: 'none', background: 'var(--bg)' }}>
                            <h3 style={{ margin: '0 0 16px', fontSize: '20px', color: 'var(--primary)' }}>Neurobiología del patrón</h3>
                            <p style={{ color: 'var(--text)', fontSize: '16px', lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: activeProfile.translation }} />
                        </div>
                    </div>
                </section>

                <section className="section-custom" id="video">
                    <div className="custom-container" style={{ textAlign: 'center' }}>
                        <h2 className="h2-custom">Entiende la raíz de tu resultado</h2>
                        <p style={{ color: 'var(--muted)', fontSize: '18px', maxWidth: '600px', margin: '0 auto 32px' }}>
                            {activeProfile.videoSub}
                        </p>
                        <div className="video-wrapper">
                            <iframe src={activeProfile.videoUrl} title={`Video explicativo ${activeProfile.title}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                        </div>
                    </div>
                </section>

                <section className="section-custom" style={{ background: '#fff' }}>
                    <div className="custom-container grid-2">
                        <div>
                            <h2 className="h2-custom">El Protocolo RFAI de 30 días</h2>
                            <p style={{ color: 'var(--muted)', fontSize: '16px', lineHeight: 1.6, marginBottom: '32px' }}>
                                Ruta terapéutica focalizada para reentrenar tu sistema nervioso y recuperar balance.
                            </p>
                            <ul className="step-list">
                                {activeProfile.protocolSteps.map((stepDesc, idx) => (
                                    <li key={idx} className="step-item">
                                        <div className="step-num">{idx + 1}</div>
                                        <div className="step-text">{stepDesc}</div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <div className="card-custom" style={{ background: 'var(--primary)', color: '#fff', border: 0 }}>
                                <h3 style={{ margin: '0 0 16px', fontSize: '24px', letterSpacing: '-.5px' }}>{activeProfile.benefitsTitle}</h3>
                                <p style={{ fontSize: '16px', lineHeight: 1.6, opacity: .9, marginBottom: '24px' }}>
                                    {activeProfile.benefitsSub}
                                </p>
                                <hr style={{ border: 0, borderTop: '1px solid rgba(255,255,255,.2)', margin: '24px 0' }} />
                                <p style={{ fontSize: '15px', lineHeight: 1.5, opacity: .8 }}>
                                    {activeProfile.closingP1}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="section-custom" id="Checkout">
                    <div className="custom-container">
                        {!isReview ? (
                            <div className="price-box">
                                <div style={{ display: 'inline-block', padding: '6px 12px', background: 'var(--ok)', color: '#047857', borderRadius: '99px', fontSize: '13px', fontWeight: 800, letterSpacing: '1px', marginBottom: '24px' }}>
                                    PROGRAMA COMPLETO DISPONIBLE
                                </div>
                                <h2 className="h2-custom" style={{ fontSize: '36px', marginBottom: '8px' }}>Tratamiento RFAI</h2>
                                <p style={{ color: 'var(--muted)', fontSize: '16px', marginBottom: '8px' }}>Tu evaluación inicial y programa completo de recuperación.</p>

                                <div style={{ fontSize: '56px', fontWeight: 900, color: 'var(--primary)', letterSpacing: '-2px', margin: '24px 0 8px' }}>
                                    $290.000<span style={{ fontSize: '18px', color: 'var(--muted)', fontWeight: 600, letterSpacing: '0' }}> CLP</span>
                                </div>
                                <p style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '32px' }}>Pago único y seguro vía MercadoPago.</p>

                                <a href={activeProfile.paymentUrl} className="btn-custom btn-primary" style={{ width: '100%', fontSize: '18px', padding: '20px' }}>
                                    Iniciar Programa Ahora
                                </a>

                                <p style={{ marginTop: '20px', fontSize: '13px', color: 'var(--muted)' }}>
                                    ¿Tienes dudas? <a href={`https://api.whatsapp.com/send/?phone=56930179724&text=${encodeURIComponent('Hola, tengo dudas sobre el protocolo RFAI para el perfil: ' + activeProfile.title)}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>Hablemos por WhatsApp</a>
                                </p>
                            </div>
                        ) : (
                            <div className="price-box" style={{ background: '#f8fafc', borderColor: '#cbd5e1' }}>
                                <div style={{ display: 'inline-block', padding: '6px 12px', background: '#e2e8f0', color: '#475569', borderRadius: '99px', fontSize: '13px', fontWeight: 800, letterSpacing: '1px', marginBottom: '24px' }}>
                                    EVALUACIÓN REQUERIDA
                                </div>
                                <h2 className="h2-custom" style={{ fontSize: '32px' }}>Análisis a Medida</h2>
                                <p style={{ color: 'var(--muted)', fontSize: '16px', marginBottom: '32px' }}>Tu evaluación inicial y programa de recuperación deben ser evaluados por nuestro equipo clínico.</p>

                                <a href={`https://api.whatsapp.com/send/?phone=56930179724&text=Hola, acabo de terminar mi test y he recibido un resultado en revisión. Me gustaría saber más detalles.`} target="_blank" rel="noopener noreferrer" className="btn-custom btn-primary" style={{ width: '100%', fontSize: '18px', padding: '20px', background: '#10b981', boxShadow: '0 12px 30px rgba(16,185,129,.25)' }}>
                                    Contactar al equipo por WhatsApp
                                </a>
                            </div>
                        )}
                    </div>
                </section>

                <footer style={{ padding: '40px 20px', textAlign: 'center', borderTop: '1px solid var(--line)', color: 'var(--muted)', fontSize: '14px' }}>
                    © Centro Clínico Equilibrar • RFAI — Reprogramación Focalizada de Alto Impacto.<br />
                    La información arrojada y expuesta en este sitio es informativa y no reemplaza diagnóstico médico oficial.
                </footer>
            </div>
        );
    }
    const getStepContent = () => {
        const startIndices = [0, 0, 7, 14, 21];
        const titles = ["", "Activación Fisiológica", "Activación Mental", "Activación Emocional", "Regulación Interna"];
        const actualStep = step;
        const startIndex = startIndices[actualStep];

        return (
            <div className="animate-fade-in-up">
                <h3 className="text-xl font-bold mb-6 text-center" style={{ color: 'var(--primary)' }}>{titles[actualStep]}</h3>
                <div className="space-y-6">
                    {questions.slice(startIndex, startIndex + 7).map((q, idx) => (
                        <QuestionRow key={startIndex + idx} index={startIndex + idx} question={q} answers={answers} setAnswer={handleAnswerChange} />
                    ))}
                </div>
            </div>
        );
    };

    const progressPercent = step > 0 ? ((step) / 4) * 100 : 0;

    return (
        <div className="rfai-test-layout">
            <style dangerouslySetInnerHTML={{
                __html: `
                .rfai-test-layout {
                  --primary:#0f97b9;
                  --primary-dark:#0a7f9a;
                  --primary-soft:#eaf7fb;
                  --text:#22343a;
                  --text-soft:#667982;
                  --line:#dfecef;
                  --bg:#ffffff;
                  --bg-soft:#f6fbfc;
                  --shadow:0 18px 40px rgba(16, 69, 82, 0.08);
                  --radius-xl:32px;
                  --radius-lg:24px;
                  --radius-md:18px;
                  --max:1180px;

                  font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
                  background:linear-gradient(180deg, #fbfeff 0%, #f4f9fa 100%);
                  color:var(--text);
                  line-height:1.55;
                  min-height: 100vh;
                }

                .rfai-test-layout a {text-decoration:none;color:inherit;}
                .rfai-test-layout img {display:block;max-width:100%;object-fit:cover;}

                .rfai-test-layout .container {
                  width:min(92%, var(--max));
                  margin:0 auto;
                }

                /* topbar */
                .rfai-test-layout .topbar {
                  position:sticky;
                  top:0;
                  z-index:999;
                  background:rgba(255,255,255,.92);
                  backdrop-filter: blur(14px);
                  border-bottom:1px solid rgba(34,52,58,.06);
                }

                .rfai-test-layout header {
                  min-height:84px;
                  display:flex;
                  align-items:center;
                  justify-content:space-between;
                  gap:20px;
                }

                .rfai-test-layout .brand {
                  display:flex;
                  align-items:center;
                  gap:14px;
                  min-width:0;
                }

                .rfai-test-layout .brand img {
                  width:54px;
                  height:54px;
                  object-fit:contain;
                  flex-shrink:0;
                }

                .rfai-test-layout .brand-copy strong {
                  display:block;
                  color:var(--text);
                  font-size:1rem;
                  line-height:1.05;
                }

                .rfai-test-layout .brand-copy span {
                  display:block;
                  margin-top:3px;
                  color:var(--text-soft);
                  font-size:.84rem;
                }

                .rfai-test-layout nav {
                  display:flex;
                  align-items:center;
                  gap:26px;
                }

                .rfai-test-layout nav a {
                  color:var(--text-soft);
                  font-size:.95rem;
                  transition:.2s ease;
                }

                .rfai-test-layout nav a:hover {
                  color:var(--primary-dark);
                }

                .rfai-test-layout .header-actions {
                  display:flex;
                  align-items:center;
                  gap:12px;
                }

                .rfai-test-layout .btn {
                  display:inline-flex;
                  align-items:center;
                  justify-content:center;
                  min-height:50px;
                  padding:0 22px;
                  border-radius:999px;
                  font-weight:600;
                  font-size:.95rem;
                  transition:.2s ease;
                  border:1px solid transparent;
                  cursor:pointer;
                  white-space:nowrap;
                }

                .rfai-test-layout .btn-primary {
                  background:linear-gradient(135deg, var(--primary), var(--primary-dark));
                  color:#fff;
                  box-shadow:0 12px 26px rgba(15,151,185,.22);
                }
                .rfai-test-layout .btn-primary:hover { transform:translateY(-1px); }
                .rfai-test-layout .btn-outline { background: #fff; border: 1px solid var(--line); color: var(--text); }
                .rfai-test-layout .btn-outline:hover { background: var(--bg-soft); }

                /* hero Step 0 */
                .rfai-test-layout .hero-step0 {
                  padding:80px 0 40px;
                  text-align:center;
                }
                .rfai-test-layout .hero-step0 h1 {
                  font-size:2.5rem;
                  margin-bottom:14px;
                  letter-spacing:-.05em;
                }
                .rfai-test-layout .hero-step0 p {
                  color:var(--text-soft);
                  max-width:600px;
                  margin:auto;
                }

                .rfai-test-layout .card-step0 {
                  background:white;
                  padding:40px;
                  border-radius:24px;
                  box-shadow:var(--shadow);
                  max-width:520px;
                  margin:40px auto;
                  border: 1px solid var(--line);
                }

                .rfai-test-layout .field {
                  margin-bottom:20px;
                  text-align:left;
                }
                .rfai-test-layout .field label {
                  display:block;
                  font-size:0.9rem;
                  margin-bottom:6px;
                  color:var(--text-soft);
                }
                .rfai-test-layout .field input {
                  width:100%;
                  padding:14px;
                  border-radius:10px;
                  border:1px solid var(--line);
                  font-size:1rem;
                  background: var(--bg-soft);
                  font-family: inherit;
                  color: var(--text);
                }
                .rfai-test-layout .field input:focus {
                  outline: none;
                  border-color: var(--primary);
                  background: #fff;
                }

                /* hero Step 1+ */
                .rfai-test-layout .hero-step1 {
                  padding:30px 0 20px;
                  background:
                    radial-gradient(circle at top left, rgba(15,151,185,.08), transparent 24%),
                    linear-gradient(180deg, #ffffff 0%, #f9fcfd 100%);
                  border-bottom:1px solid var(--line);
                }
                .rfai-test-layout .hero-wrap {
                  display:flex;
                  justify-content:space-between;
                  align-items:flex-end;
                  gap:24px;
                  flex-wrap:wrap;
                }
                .rfai-test-layout .eyebrow {
                  display:inline-flex;
                  align-items:center;
                  gap:8px;
                  padding:8px 14px;
                  border-radius:999px;
                  background:var(--primary-soft);
                  color:var(--primary-dark);
                  font-size:.88rem;
                  font-weight:700;
                  margin-bottom:14px;
                }
                .rfai-test-layout .hero-step1 h1 {
                  font-size:clamp(2rem, 5vw, 3.3rem);
                  line-height:.97;
                  letter-spacing:-.05em;
                  margin-bottom:10px;
                }
                .rfai-test-layout .hero-step1 p {
                  color:var(--text-soft);
                  font-size:1rem;
                  max-width:58ch;
                }
                .rfai-test-layout .hero-side {
                  display:flex;
                  gap:12px;
                  flex-wrap:wrap;
                }
                .rfai-test-layout .chip {
                  background:#fff;
                  border:1px solid var(--line);
                  border-radius:999px;
                  padding:12px 16px;
                  color:var(--primary-dark);
                  font-size:.92rem;
                  font-weight:600;
                  box-shadow:var(--shadow);
                }

                .rfai-test-layout .section {
                  padding:28px 0 90px;
                }

                .rfai-test-layout .test-frame {
                  background:#fff;
                  border:1px solid var(--line);
                  border-radius:32px;
                  box-shadow:var(--shadow);
                  overflow:hidden;
                }

                .rfai-test-layout .test-frame-top {
                  padding:20px 24px;
                  border-bottom:1px solid var(--line);
                  background:linear-gradient(180deg, #ffffff 0%, #f9fcfd 100%);
                  display:flex;
                  justify-content:space-between;
                  align-items:center;
                  gap:18px;
                  flex-wrap:wrap;
                }

                .rfai-test-layout .test-frame-top h2 {
                  font-size:1.2rem;
                  margin-bottom:4px;
                }

                .rfai-test-layout .test-frame-top p {
                  color:var(--text-soft);
                  font-size:.94rem;
                }

                .rfai-test-layout .test-progress {
                  min-width:220px;
                  flex:1;
                  max-width:320px;
                }

                .rfai-test-layout .progress-label {
                  display:flex;
                  justify-content:space-between;
                  font-size:.9rem;
                  color:var(--text-soft);
                  margin-bottom:8px;
                }

                .rfai-test-layout .progress-bar {
                  width:100%;
                  height:10px;
                  border-radius:999px;
                  background:#eaf3f5;
                  overflow:hidden;
                }

                .rfai-test-layout .progress-fill {
                  height:100%;
                  background:linear-gradient(135deg, var(--primary), var(--primary-dark));
                  border-radius:999px;
                  transition: width 0.3s ease;
                }

                .rfai-test-layout .test-content {
                  padding:0;
                }

                .rfai-test-layout .test-mount {
                  min-height:300px;
                  background:#fff;
                  padding: 24px;
                }

                .rfai-test-layout .frame-note {
                  padding:16px 24px 24px;
                  border-top:1px solid var(--line);
                  color:var(--text-soft);
                  font-size:.92rem;
                  background:#fcfeff;
                }

                .rfai-test-layout footer {
                  padding:28px 0 40px;
                  border-top:1px solid rgba(34,52,58,.06);
                  background:#fff;
                }

                .rfai-test-layout .footer-row {
                  display:flex;
                  justify-content:space-between;
                  align-items:center;
                  gap:18px;
                  flex-wrap:wrap;
                }

                .rfai-test-layout .footer-links {
                  display:flex;
                  gap:16px;
                  flex-wrap:wrap;
                }

                .rfai-test-layout .error-box {
                  margin: 20px 0;
                  padding: 14px;
                  border-radius: 12px;
                  background: #fee2e2;
                  color: #991b1b;
                  border: 1px solid #fecaca;
                  text-align: center;
                  font-size: 14px;
                }

                @media (max-width: 760px){
                  .rfai-test-layout nav { display:none; }
                  .rfai-test-layout .header-actions { flex-direction:column; align-items:stretch; }
                  .rfai-test-layout .brand-copy span { display:none; }
                  .rfai-test-layout .test-frame-top, .rfai-test-layout .frame-note { padding-left:20px; padding-right:20px; }
                  .rfai-test-layout .test-mount { padding: 16px; }
                  .rfai-test-layout .test-controls { flex-direction: column-reverse; gap: 12px; }
                  .rfai-test-layout .test-controls button { width: 100%; }
                }
            `}} />

            <div className="topbar">
                <header className="container">
                    <a href="#/" className="brand">
                        <img src={logoImg} alt="Logo Centro Clínico Equilibrar" />
                        <div className="brand-copy">
                            <strong>Centro Clínico Equilibrar</strong>
                            <span>Psicología clínica y modelo RFAI</span>
                        </div>
                    </a>

                    <nav>
                        <a href="#/">Inicio</a>
                        <a href="#/rfai">Conocer RFAI</a>
                    </nav>

                    {step === 0 && (
                        <div className="header-actions">
                            <button className="btn btn-outline" onClick={() => { document.getElementById("form-inicio")?.scrollIntoView({ behavior: "smooth" }) }}>Comenzar ahora</button>
                        </div>
                    )}
                </header>
            </div>

            <main>
                {step === 0 ? (
                    <section className="hero-step0">
                        <div className="container">
                            <h1>Comienza el Test RFAI</h1>
                            <p>
                                Antes de comenzar necesitamos registrar tu nombre y correo para poder enviarte
                                el resultado de tu evaluación.
                            </p>

                            <div className="card-step0" id="form-inicio">
                                <form onSubmit={(e) => { e.preventDefault(); nextStep(); }}>
                                    <div className="field">
                                        <label>Nombre completo</label>
                                        <input type="text" name="name" value={userInfo.name} onChange={handleUserInfoChange} required placeholder="Ej. Juan Pérez" />
                                    </div>

                                    <div className="field">
                                        <label>Correo electrónico</label>
                                        <input type="email" name="email" value={userInfo.email} onChange={handleUserInfoChange} required placeholder="ejemplo@correo.com" />
                                    </div>

                                    {error && <div className="error-box">{error}</div>}

                                    <button className="btn btn-primary" type="submit" style={{ width: "100%", marginTop: "10px" }}>
                                        Comenzar test
                                    </button>
                                </form>
                            </div>
                        </div>
                    </section>
                ) : (
                    <>
                        <section className="hero-step1">
                            <div className="container hero-wrap">
                                <div>
                                    <div className="eyebrow">Paso {step} de 4</div>
                                    <h1>Ingresa a responder</h1>
                                    <p>Esta página es la entrada directa al test. Aquí comienza tu evaluación.</p>
                                </div>

                                <div className="hero-side">
                                    <div className="chip">Breve</div>
                                    <div className="chip">Directo</div>
                                    <div className="chip">Orientador</div>
                                </div>
                            </div>
                        </section>

                        <section className="section">
                            <div className="container">
                                <div className="test-frame">
                                    <div className="test-frame-top">
                                        <div>
                                            <h2>Test RFAI</h2>
                                            <p>Responde las preguntas y avanza hasta completar tu evaluación.</p>
                                        </div>

                                        <div className="test-progress">
                                            <div className="progress-label">
                                                <span>Progreso</span>
                                                <span>{Math.round(progressPercent)}%</span>
                                            </div>
                                            <div className="progress-bar">
                                                <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="test-content">
                                        <div className="test-mount" id="rfai-test-app">
                                            {getStepContent()}

                                            {error && <div className="error-box">{error}</div>}

                                            {/* Controles de Navegación */}
                                            <div className="test-controls mt-8 flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
                                                <button
                                                    onClick={prevStep}
                                                    disabled={isSubmitting}
                                                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs text-slate-600 hover:bg-slate-50 hover:text-brand-primary transition-all disabled:opacity-50"
                                                >
                                                    <ArrowLeft size={16} /> Atrás
                                                </button>

                                                {step < 4 ? (
                                                    <button
                                                        onClick={nextStep}
                                                        className="flex items-center gap-2 px-8 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-all font-bold uppercase tracking-widest text-xs"
                                                    >
                                                        Continuar <ArrowRight size={16} />
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={handleSubmit}
                                                        disabled={isSubmitting}
                                                        className="btn btn-primary"
                                                        style={{ height: "auto", padding: "12px 24px", minHeight: "46px" }}
                                                    >
                                                        {isSubmitting ? 'Procesando...' : 'Finalizar y ver resultado'}
                                                        {!isSubmitting && <CheckCircle2 size={16} className="ml-2" />}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="frame-note">
                                        Esta evaluación no reemplaza una valoración clínica completa. Funciona como una lectura inicial orientadora.
                                    </div>
                                </div>
                            </div>
                        </section>
                    </>
                )}
            </main>

            <footer>
                <div className="container footer-row">
                    <p>© 2026 Centro Clínico Equilibrar</p>
                    <div className="footer-links">
                        <a href="#/">Inicio</a>
                        <a href="#/rfai">Modelo RFAI</a>
                    </div>
                </div>
            </footer>
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
