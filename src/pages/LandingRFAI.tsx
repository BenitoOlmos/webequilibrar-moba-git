import React from 'react';
import { Link } from 'react-router-dom';

import logo from '../assets/images/logo.png';
import img1 from '../assets/images/1.png';
import img2 from '../assets/images/2.png';
import img3 from '../assets/images/3.png';

export default function LandingRFAI() {
    return (
        <div style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', background: 'radial-gradient(circle at top left, rgba(15,151,185,.06), transparent 24%), linear-gradient(180deg, #fbfeff 0%, #f4f9fa 100%)', color: '#1f2f36', lineHeight: 1.6 }}>
            <style dangerouslySetInnerHTML={{
                __html: `
        .rfai-root {
          --primary:#0f97b9;
          --primary-dark:#0a7f9a;
          --primary-soft:#eaf7fb;
          --text:#1f2f36;
          --text-soft:#6f8088;
          --bg:#f7fbfc;
          --white:#ffffff;
          --line:rgba(15,151,185,.12);
          --shadow:0 20px 50px rgba(8, 61, 74, 0.10);
          --radius-xl:32px;
          --radius-lg:22px;
          --radius-md:16px;
          --max:1180px;
        }

        .rfai-container { width: min(92%, 1180px); margin: 0 auto; }
        .rfai-topbar { position: sticky; top: 0; z-index: 50; backdrop-filter: blur(12px); background: rgba(251,254,255,.86); border-bottom: 1px solid rgba(15,151,185,.08); }
        .rfai-header { min-height: 84px; display: flex; justify-content: space-between; align-items: center; gap: 20px; }
        .rfai-logo { display: flex; align-items: center; gap: 14px; text-decoration: none; }
        .rfai-logo img { width: 52px; height: 52px; object-fit: contain; }
        .rfai-logo-copy strong { display: block; font-size: 1rem; color: #0a7f9a; letter-spacing: .02em; line-height: 1.05; }
        .rfai-logo-copy span { display: block; margin-top: 2px; font-size: .83rem; color: #6f8088; }
        .rfai-nav { display: flex; align-items: center; gap: 26px; }
        .rfai-nav a { font-size: .95rem; color: #6f8088; transition: .2s ease; text-decoration: none; }
        .rfai-nav a:hover { color: #0a7f9a; }
        .rfai-btn { display: inline-flex; align-items: center; justify-content: center; min-height: 50px; padding: 0 24px; border-radius: 999px; font-size: .96rem; font-weight: 600; transition: .2s ease; border: 1px solid transparent; cursor: pointer; white-space: nowrap; text-decoration: none; }
        .rfai-btn-primary { background: linear-gradient(135deg, #0f97b9, #0a7f9a); color: #fff; box-shadow: 0 14px 28px rgba(15,151,185,.20); }
        .rfai-btn-primary:hover { transform: translateY(-1px); }
        .rfai-btn-outline { background: transparent; border-color: rgba(15,151,185,.22); color: #0a7f9a; }
        .rfai-btn-outline:hover { background: rgba(15,151,185,.05); }
        .rfai-hero { padding: 46px 0 84px; }
        .rfai-hero-grid { display: grid; grid-template-columns: 1fr 1.02fr; gap: 54px; align-items: center; }
        .rfai-eyebrow { display: inline-flex; padding: 8px 14px; border-radius: 999px; background: rgba(15,151,185,.07); color: #0a7f9a; border: 1px solid rgba(15,151,185,.10); font-size: .88rem; font-weight: 700; margin-bottom: 18px; }
        .rfai-hero h1 { font-size: clamp(2.8rem, 6vw, 5rem); line-height: .98; letter-spacing: -.05em; max-width: 10ch; margin-bottom: 18px; }
        .rfai-hero p { font-size: 1.08rem; color: #6f8088; max-width: 52ch; }
        .rfai-hero-buttons { display: flex; gap: 14px; flex-wrap: wrap; margin-top: 30px; }
        .rfai-hero-meta { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 24px; }
        .rfai-meta-chip { display: inline-flex; align-items: center; padding: 10px 14px; border-radius: 999px; background: rgba(255,255,255,.82); border: 1px solid rgba(15,151,185,.12); color: #0a7f9a; font-size: .92rem; font-weight: 600; }
        .rfai-hero-media { position: relative; min-height: 660px; border-radius: 32px; overflow: hidden; box-shadow: 0 20px 50px rgba(8, 61, 74, 0.10); background: #fff; border: 1px solid rgba(15,151,185,.12); }
        .rfai-hero-media img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .rfai-hero-media::after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,.03), rgba(0,0,0,.12)), linear-gradient(135deg, rgba(15,151,185,.08), rgba(15,151,185,.02)); }
        .rfai-hero-note { position: absolute; left: 24px; bottom: 24px; z-index: 2; background: rgba(255,255,255,.88); backdrop-filter: blur(10px); padding: 16px 18px; border-radius: 18px; max-width: 320px; box-shadow: 0 10px 30px rgba(0,0,0,.08); }
        .rfai-hero-note strong { display: block; color: #0a7f9a; margin-bottom: 4px; font-size: .95rem; }
        .rfai-hero-note span { color: #6f8088; font-size: .92rem; }
        .rfai-section { padding: 88px 0; }
        .rfai-section-head { max-width: 760px; margin-bottom: 34px; }
        .rfai-section-head h2 { font-size: clamp(2rem, 4vw, 3.5rem); line-height: 1.02; letter-spacing: -.04em; margin-bottom: 14px; }
        .rfai-section-head p { color: #6f8088; font-size: 1.04rem; max-width: 60ch; }
        .rfai-split { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: center; }
        .rfai-side-photo { min-height: 560px; border-radius: 32px; overflow: hidden; box-shadow: 0 20px 50px rgba(8, 61, 74, 0.10); border: 1px solid rgba(15,151,185,.12); position: relative; background: #fff; }
        .rfai-side-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .rfai-side-photo::after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,.02), rgba(0,0,0,.10)), linear-gradient(135deg, rgba(15,151,185,.06), rgba(15,151,185,.02)); }
        .rfai-signal-list { display: grid; gap: 12px; margin-top: 24px; }
        .rfai-signal-item { padding: 16px 18px; background: rgba(255,255,255,.84); border: 1px solid rgba(15,151,185,.12); border-radius: 18px; box-shadow: 0 10px 24px rgba(8, 61, 74, 0.05); color: #0a7f9a; font-weight: 600; }
        .rfai-observe-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 18px; margin-top: 26px; }
        .rfai-info-card { background: rgba(255,255,255,.82); border: 1px solid rgba(15,151,185,.12); border-radius: 24px; padding: 24px; box-shadow: 0 20px 50px rgba(8, 61, 74, 0.10); min-height: 180px; }
        .rfai-info-card h3 { font-size: 1.08rem; margin-bottom: 10px; color: #1f2f36; }
        .rfai-info-card p { color: #6f8088; font-size: .98rem; }
        .rfai-process-box { background: linear-gradient(145deg, rgba(255,255,255,.90), rgba(255,255,255,.76)); border: 1px solid rgba(15,151,185,.12); border-radius: 28px; padding: 32px; box-shadow: 0 20px 50px rgba(8, 61, 74, 0.10); }
        .rfai-process-box h3 { font-size: 1.2rem; margin-bottom: 16px; color: #0a7f9a; }
        .rfai-process-steps { display: grid; gap: 14px; }
        .rfai-process-step { display: grid; grid-template-columns: 42px 1fr; gap: 14px; align-items: start; }
        .rfai-step-num { width: 42px; height: 42px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: #eaf7fb; color: #0a7f9a; font-weight: 700; }
        .rfai-step-copy strong { display: block; margin-bottom: 4px; color: #1f2f36; font-size: 1rem; }
        .rfai-step-copy span { color: #6f8088; font-size: .97rem; }
        .rfai-result-list { display: grid; gap: 12px; margin-top: 24px; }
        .rfai-result-item { padding: 16px 18px; background: rgba(255,255,255,.84); border: 1px solid rgba(15,151,185,.12); border-radius: 18px; box-shadow: 0 10px 24px rgba(8, 61, 74, 0.05); color: #6f8088; }
        .rfai-assurance { background: linear-gradient(180deg, rgba(15,151,185,.04), transparent 100%); }
        .rfai-assurance-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 18px; }
        .rfai-assurance-card { background: rgba(255,255,255,.86); border: 1px solid rgba(15,151,185,.12); border-radius: 24px; padding: 24px; box-shadow: 0 20px 50px rgba(8, 61, 74, 0.10); min-height: 190px; }
        .rfai-assurance-card h3 { font-size: 1.06rem; margin-bottom: 10px; color: #0a7f9a; }
        .rfai-assurance-card p { color: #6f8088; font-size: .98rem; }
        .rfai-cta { padding: 92px 0; }
        .rfai-cta-box { background: linear-gradient(135deg, #0f97b9, #0a7f9a); color: #fff; border-radius: 34px; padding: 44px; box-shadow: 0 24px 60px rgba(12, 80, 96, 0.20); }
        .rfai-cta-box h2 { font-size: clamp(2rem, 4vw, 3.6rem); line-height: .98; letter-spacing: -.04em; max-width: 11ch; margin-bottom: 14px; }
        .rfai-cta-box p { max-width: 54ch; color: rgba(255,255,255,.92); margin-bottom: 26px; font-size: 1.04rem; }
        .rfai-cta-actions { display: flex; gap: 14px; flex-wrap: wrap; }
        .rfai-cta-box .rfai-btn-primary { background: #fff; color: #0a7f9a; box-shadow: none; }
        .rfai-cta-box .rfai-btn-outline { color: #fff; border-color: rgba(255,255,255,.34); }
        .rfai-cta-box .rfai-btn-outline:hover { background: rgba(255,255,255,.10); }
        .rfai-footer { padding: 28px 0 40px; border-top: 1px solid rgba(15,151,185,.08); background: rgba(255,255,255,.65); }
        .rfai-footer-row { display: flex; justify-content: space-between; align-items: center; gap: 18px; flex-wrap: wrap; }
        .rfai-footer-row p, .rfai-footer-row a { font-size: .94rem; color: #6f8088; text-decoration: none; }
        .rfai-footer-links { display: flex; gap: 16px; flex-wrap: wrap; }

        @media (max-width: 980px){
          .rfai-hero-grid, .rfai-split { grid-template-columns: 1fr; }
          .rfai-observe-grid, .rfai-assurance-grid { grid-template-columns: 1fr 1fr; }
          .rfai-hero-media, .rfai-side-photo { min-height: auto; }
        }

        @media (max-width: 760px){
          .rfai-nav { display: none; }
          .rfai-observe-grid, .rfai-assurance-grid { grid-template-columns: 1fr; }
          .rfai-hero-buttons, .rfai-cta-actions { flex-direction: column; }
          .rfai-btn { width: 100%; }
          .rfai-hero { padding-top: 24px; }
        }
        `
            }} />

            <div className="rfai-root">
                <div className="rfai-topbar">
                    <header className="rfai-container rfai-header">
                        <a href="/#/" className="rfai-logo" aria-label="Centro Clínico Equilibrar">
                            <img src={logo} alt="Logo Centro Clínico Equilibrar" />
                            <div className="rfai-logo-copy">
                                <strong>CENTRO CLÍNICO EQUILIBRAR</strong>
                                <span>Lectura inicial de tu patrón emocional</span>
                            </div>
                        </a>
                        <nav className="rfai-nav">
                            <a href="/#/">Inicio</a>
                            <a href="/#/#test">Test</a>
                            <a href="/#/#rfai">RFAI</a>
                            <a href="/#/#podcast">Podcast</a>
                            <a href="/#/#equipo">Equipo</a>
                            <a href="#contacto">Contacto</a>
                        </nav>
                        <a className="rfai-btn rfai-btn-primary" href="/#/test-rfai">Comenzar evaluación</a>
                    </header>
                </div>

                <main>
                    <section className="rfai-hero" id="que-es">
                        <div className="rfai-container rfai-hero-grid">
                            <div>
                                <div className="rfai-eyebrow">Test RFAI • Lectura inicial • Centro Clínico Equilibrar</div>
                                <h1>No es un test de personalidad</h1>
                                <p>
                                    Es una primera lectura clínica de cómo está funcionando tu activación,
                                    tu regulación y tu patrón emocional actual.
                                </p>
                                <div className="rfai-hero-meta">
                                    <div className="rfai-meta-chip">Breve y simple</div>
                                    <div className="rfai-meta-chip">Sin respuestas correctas</div>
                                    <div className="rfai-meta-chip">Orientación inicial clara</div>
                                </div>
                                <div className="rfai-hero-buttons">
                                    <a className="rfai-btn rfai-btn-primary" href="/#/test-rfai">Comenzar evaluación</a>
                                    <a className="rfai-btn rfai-btn-outline" href="#recibes">Qué recibiré</a>
                                </div>
                            </div>
                            <div className="rfai-hero-media">
                                <img src={img1} alt="Acompañamiento humano y contención" />
                                <div className="rfai-hero-note">
                                    <strong>Una lectura inicial</strong>
                                    <span>No busca etiquetarte. Busca darte una comprensión más clara de lo que estás viviendo.</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="rfai-section" id="observa">
                        <div className="rfai-container rfai-split">
                            <div>
                                <div className="rfai-section-head" style={{ marginBottom: 0 }}>
                                    <h2>Qué observa este test</h2>
                                    <p>
                                        El Test RFAI fue diseñado para ayudarte a mirar con mayor claridad
                                        cómo se organiza hoy tu experiencia emocional.
                                    </p>
                                </div>
                                <div className="rfai-observe-grid">
                                    <article className="rfai-info-card">
                                        <h3>Activación emocional</h3>
                                        <p>Observa cómo se movilizan tus emociones frente al estrés, la exigencia o el conflicto.</p>
                                    </article>
                                    <article className="rfai-info-card">
                                        <h3>Activación racional</h3>
                                        <p>Permite identificar cuánto predomina la mente analítica, el control o la sobreinterpretación.</p>
                                    </article>
                                    <article className="rfai-info-card">
                                        <h3>Activación fisiológica</h3>
                                        <p>Considera señales corporales vinculadas a tensión, cansancio, agitación o bloqueo.</p>
                                    </article>
                                    <article className="rfai-info-card">
                                        <h3>Regulación</h3>
                                        <p>Evalúa cómo está funcionando hoy tu capacidad de volver a la calma y sostenerte internamente.</p>
                                    </article>
                                </div>
                            </div>
                            <div className="rfai-side-photo">
                                <img src={img3} alt="Malestar emocional y sobrecarga" />
                            </div>
                        </div>
                    </section>

                    <section className="rfai-section rfai-assurance">
                        <div className="rfai-container">
                            <div className="rfai-section-head">
                                <h2>Qué hace distinta esta experiencia</h2>
                                <p>
                                    La propuesta no es llenar un formulario más. Es iniciar una observación breve
                                    que te permita comprender una parte importante de la lógica que organiza tu malestar actual.
                                </p>
                            </div>
                            <div className="rfai-assurance-grid">
                                <article className="rfai-assurance-card">
                                    <h3>No busca etiquetarte</h3>
                                    <p>El objetivo no es reducirte a una categoría, sino darte una orientación inicial más útil y precisa.</p>
                                </article>
                                <article className="rfai-assurance-card">
                                    <h3>No hay respuestas buenas o malas</h3>
                                    <p>Lo importante es que respondas desde tu experiencia actual, con honestidad y sin exigencia.</p>
                                </article>
                                <article className="rfai-assurance-card">
                                    <h3>Es una primera lectura, no un diagnóstico completo</h3>
                                    <p>Puede orientarte con claridad y ayudarte a decidir si necesitas un trabajo más profundo.</p>
                                </article>
                            </div>
                        </div>
                    </section>

                    <section className="rfai-section" id="recibes">
                        <div className="rfai-container rfai-split">
                            <div className="rfai-process-box">
                                <h3>Al finalizar recibirás</h3>
                                <div className="rfai-process-steps">
                                    <div className="rfai-process-step">
                                        <div className="rfai-step-num">1</div>
                                        <div className="rfai-step-copy">
                                            <strong>Una lectura inicial de tu perfil</strong>
                                            <span>Una primera síntesis de cómo está funcionando tu patrón emocional actual.</span>
                                        </div>
                                    </div>
                                    <div className="rfai-process-step">
                                        <div className="rfai-step-num">2</div>
                                        <div className="rfai-step-copy">
                                            <strong>Comprensión de tu forma de responder al estrés</strong>
                                            <span>Una orientación sobre la lógica interna que puede estar sosteniendo tu malestar.</span>
                                        </div>
                                    </div>
                                    <div className="rfai-process-step">
                                        <div className="rfai-step-num">3</div>
                                        <div className="rfai-step-copy">
                                            <strong>Orientación sobre si RFAI puede ayudarte</strong>
                                            <span>Una primera referencia para saber si este modelo puede ser adecuado para ti.</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="rfai-section-head" style={{ marginBottom: 0 }}>
                                    <h2>Qué recibirás después de responder</h2>
                                    <p>
                                        Antes de pedirte tiempo y atención, es importante que sepas qué obtendrás a cambio.
                                        El valor del test está en la claridad que puede abrir.
                                    </p>
                                </div>
                                <div className="rfai-result-list">
                                    <div className="rfai-result-item">Una lectura breve, clara y comprensible.</div>
                                    <div className="rfai-result-item">Un acercamiento más preciso a tu forma de funcionamiento actual.</div>
                                    <div className="rfai-result-item">Un punto de partida más sólido para decidir tus próximos pasos.</div>
                                </div>
                                <div className="rfai-hero-buttons">
                                    <a className="rfai-btn rfai-btn-primary" href="/#/test-rfai">Iniciar lectura inicial</a>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="rfai-section">
                        <div className="rfai-container rfai-split">
                            <div>
                                <div className="rfai-section-head" style={{ marginBottom: 0 }}>
                                    <h2>Un proceso breve y cuidado</h2>
                                    <p>
                                        La experiencia fue pensada para que puedas realizarla de forma simple, sin presión
                                        y con suficiente claridad sobre lo que estás observando.
                                    </p>
                                </div>
                                <div className="rfai-signal-list">
                                    <div className="rfai-signal-item">Te tomará pocos minutos.</div>
                                    <div className="rfai-signal-item">No necesitas prepararte de una forma especial.</div>
                                    <div className="rfai-signal-item">Solo responde desde cómo te sientes y funcionas hoy.</div>
                                    <div className="rfai-signal-item">Al final tendrás una orientación inicial más ordenada.</div>
                                </div>
                            </div>
                            <div className="rfai-side-photo">
                                <img src={img2} alt="Calma, respiración y autorregulación" />
                            </div>
                        </div>
                    </section>

                    <section className="rfai-cta" id="comenzar" style={{ paddingBottom: '0' }}>
                        <div className="rfai-container">
                            <div className="rfai-cta-box">
                                <h2>Comienza tu evaluación inicial</h2>
                                <p>
                                    En pocos minutos podrás observar una parte importante de la lógica que organiza
                                    tu malestar actual y recibir una primera orientación clínica.
                                </p>
                                <div className="rfai-cta-actions">
                                    <a className="rfai-btn rfai-btn-primary" href="/#/test-rfai">Comenzar evaluación</a>
                                    <a className="rfai-btn rfai-btn-outline" href="https://wa.me/56930179724" target="_blank" rel="noopener noreferrer">
                                        Resolver una duda antes
                                    </a>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>

                <footer className="rfai-footer" style={{ marginTop: '80px' }}>
                    <div className="rfai-container rfai-footer-row">
                        <p>© 2026 Centro Clínico Equilibrar</p>
                        <div className="rfai-footer-links">
                            <a href="/#/">Inicio</a>
                            <a href="/#/#test">Test</a>
                            <a href="/#/#rfai">RFAI</a>
                            <a href="/#/#podcast">Podcast</a>
                            <a href="/#/#equipo">Equipo</a>
                            <a href="#contacto">Contacto</a>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}
