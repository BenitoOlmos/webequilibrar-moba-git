import React from 'react';

import logo from '../assets/images/logo.png';
import img1 from '../assets/images/1.png';
import img2 from '../assets/images/2.png';
import img3 from '../assets/images/3.png';

const Home: React.FC = () => {
   return (
      <div style={{ fontFamily: '"Inter", sans-serif', background: '#f6fbfc', color: '#1f2f36', lineHeight: 1.6 }}>
         <style dangerouslySetInnerHTML={{
            __html: `
                .home-container { width: 90%; max-width: 1180px; margin: auto; }
                .home-header { display: flex; justify-content: space-between; align-items: center; padding: 32px 0; }
                .home-logo { display: flex; align-items: center; gap: 14px; }
                .home-logo img { width: 54px; }
                .home-nav a { margin-left: 28px; font-size: 15px; color: #6f8088; text-decoration: none; }
                .home-nav a:hover { color: #0f97b9; }
                .home-hero { padding: 70px 0 100px; }
                .home-hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 70px; align-items: center; }
                .home-hero h1 { font-size: 52px; line-height: 1.05; margin-bottom: 20px; }
                .home-hero p { font-size: 18px; color: #6f8088; max-width: 420px; }
                .home-btn { display: inline-block; padding: 14px 26px; border-radius: 40px; font-weight: 600; margin-top: 30px; text-decoration: none; }
                .home-btn-primary { background: #0f97b9; color: white; }
                .home-hero img { width: 100%; border-radius: 14px; }
                .home-section { padding: 110px 0; }
                .home-section h2 { font-size: 40px; margin-bottom: 20px; }
                .home-section p { color: #6f8088; max-width: 600px; }
                .home-split { display: grid; grid-template-columns: 1fr 1fr; gap: 70px; align-items: center; }
                .home-split img { border-radius: 12px; width: 100%; object-fit: cover; }
                .home-rfai-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 50px; margin-top: 50px; }
                .home-rfai-item h3 { font-size: 20px; margin-bottom: 10px; }
                .home-podcast { background: #eaf7fb; }
                .home-team { background: white; }
                .home-team-intro { max-width: 600px; margin-bottom: 50px; }
                .home-team-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; }
                .home-team-member h3 { font-size: 24px; margin-bottom: 6px; }
                .home-team-role { color: #0f97b9; font-weight: 600; margin-bottom: 12px; }
                .home-team-member p { color: #6f8088; }
                .home-team-member details { margin-top: 12px; }
                .home-team-member summary { cursor: pointer; color: #0f97b9; font-weight: 600; }
                .home-cta { background: #0f97b9; color: white; text-align: center; padding: 90px 0; }
                .home-cta h2 { font-size: 42px; margin-bottom: 16px; }
                .home-footer { text-align: center; padding: 30px 0; color: #6f8088; }

                @media(max-width: 900px){
                    .home-hero-grid, .home-split, .home-team-grid { grid-template-columns: 1fr; }
                    .home-rfai-grid { grid-template-columns: 1fr; }
                    .home-hero h1 { font-size: 40px; }
                    .home-nav { display: none; } /* Basic mobile nav hiding to match original style simplicity assuming basic implementation */
                }
                `
         }} />

         <header className="home-container home-header">
            <div className="home-logo">
               <img src={logo} alt="Logo" />
               <strong>Centro Clínico Equilibrar</strong>
            </div>
            <nav className="home-nav">
               <a href="#test">Test</a>
               <a href="#rfai">RFAI</a>
               <a href="#podcast">Podcast</a>
               <a href="#equipo">Equipo</a>
            </nav>
         </header>

         <section className="home-hero home-container">
            <div className="home-hero-grid">
               <div>
                  <h1>Entiende el patrón emocional que está dirigiendo tu vida</h1>
                  <p>
                     Un enfoque clínico que integra psicología, neurociencia
                     y trabajo terapéutico profundo para transformar
                     patrones emocionales automáticos.
                  </p>
                  <a className="home-btn home-btn-primary" href="/#/rfai">Hacer test</a>
               </div>
               <img src={img1} alt="Hero" />
            </div>
         </section>

         <section className="home-section home-container" id="test">
            <div className="home-split">
               <div>
                  <h2>Quizás lo que sientes tiene una lógica más profunda</h2>
                  <p>
                     Muchas personas viven ansiedad, cansancio o bloqueo
                     sin comprender qué patrón emocional sostiene ese malestar.
                     <br /><br />
                     El test RFAI permite observar cómo está funcionando
                     tu mente hoy.
                  </p>
                  <a className="home-btn home-btn-primary" href="/#/rfai">Descubrir mi perfil</a>
               </div>
               <img src={img3} alt="Test" />
            </div>
         </section>

         <section className="home-section home-container" id="rfai">
            <h2>RFAI</h2>
            <p>
               RFAI significa <strong>Reprogramación Focalizada de Alto Impacto</strong>.
               <br /><br />
               Es un modelo terapéutico diseñado para intervenir
               patrones emocionales automáticos y generar cambios
               profundos en la forma en que una persona experimenta
               y responde a su vida.
            </p>
            <div className="home-rfai-grid">
               <div className="home-rfai-item">
                  <h3>Diagnóstico</h3>
                  <p>El test identifica cómo respondes emocionalmente frente al estrés.</p>
               </div>
               <div className="home-rfai-item">
                  <h3>Reprogramación</h3>
                  <p>Sesiones terapéuticas orientadas a patrones inconscientes.</p>
               </div>
               <div className="home-rfai-item">
                  <h3>Integración</h3>
                  <p>Prácticas para consolidar cambios emocionales sostenidos.</p>
               </div>
            </div>
         </section>

         <section className="home-section home-podcast" id="podcast">
            <div className="home-container home-split">
               <img src={img2} alt="Podcast" />
               <div>
                  <h2>Podcast de Claudio Reyes</h2>
                  <p>
                     Un espacio donde se presenta el modelo de trabajo
                     del Centro Clínico Equilibrar y se exploran nuevas
                     formas de comprender el funcionamiento de la mente.
                  </p>
                  <a className="home-btn home-btn-primary" href="https://open.spotify.com/show/5qVcMLQ7yffuS7VA3jA6Sh" target="_blank" rel="noreferrer">
                     Escuchar en Spotify
                  </a>
               </div>
            </div>
         </section>

         <section className="home-section home-team home-container" id="equipo">
            <div className="home-team-intro">
               <h2>Equipo clínico</h2>
               <p>
                  El trabajo terapéutico del Centro Clínico Equilibrar
                  se apoya en una mirada interdisciplinaria que integra
                  psicología clínica, neurociencia, trabajo somático
                  y asesoría médica especializada.
               </p>
            </div>
            <div className="home-team-grid">
               <div className="home-team-member">
                  <h3>Claudio Reyes</h3>
                  <div className="home-team-role">Psicólogo · Director Ejecutivo</div>
                  <p>Psicólogo clínico y director del Centro Clínico Equilibrar.</p>
                  <details>
                     <summary>Ver trayectoria</summary>
                     <p style={{ marginTop: '10px' }}>
                        Ha desarrollado una trayectoria centrada en el
                        acompañamiento terapéutico profundo y el diseño
                        de modelos de intervención orientados a la
                        transformación emocional.<br /><br />
                        Es el creador del enfoque RFAI y ha trabajado
                        en el desarrollo del modelo clínico del Centro.
                     </p>
                  </details>
               </div>
               <div className="home-team-member">
                  <h3>Carlos Carrasco</h3>
                  <div className="home-team-role">Neurocientífico · Director de Investigación</div>
                  <p>Aporta una mirada científica al modelo terapéutico del Centro.</p>
                  <details>
                     <summary>Ver trayectoria</summary>
                     <p style={{ marginTop: '10px' }}>
                        Su trabajo se enfoca en comprender los procesos
                        neurobiológicos asociados al aprendizaje emocional,
                        la regulación del estrés y la transformación
                        de patrones de comportamiento.
                     </p>
                  </details>
               </div>
               <div className="home-team-member">
                  <h3>Valentín Keller</h3>
                  <div className="home-team-role">Terapeuta oriental · Director del área somática</div>
                  <p>Integra la dimensión corporal al trabajo terapéutico del Centro.</p>
                  <details>
                     <summary>Ver trayectoria</summary>
                     <p style={{ marginTop: '10px' }}>
                        Su enfoque incorpora herramientas de regulación corporal,
                        presencia y conciencia somática, contribuyendo a integrar
                        la dimensión física dentro del proceso terapéutico.
                     </p>
                  </details>
               </div>
               <div className="home-team-member">
                  <h3>Alan Lama</h3>
                  <div className="home-team-role">Psiquiatra · Asesor en medicina y psiquiatría</div>
                  <p>Apoya el modelo clínico con una mirada médica especializada.</p>
                  <details>
                     <summary>Ver trayectoria</summary>
                     <p style={{ marginTop: '10px' }}>
                        Su rol consiste en aportar criterios clínicos y evaluación
                        psiquiátrica cuando es necesario, fortaleciendo el enfoque
                        integral del Centro.
                     </p>
                  </details>
               </div>
            </div>
         </section>

         <section className="home-cta">
            <div className="home-container">
               <h2>Haz el test y descubre tu patrón emocional</h2>
               <a className="home-btn home-btn-primary" href="/#/rfai" style={{ background: '#fff', color: '#0f97b9' }}>
                  Hacer test
               </a>
            </div>
         </section>

         <footer className="home-footer">
            Centro Clínico Equilibrar — 2026
         </footer>
      </div>
   );
};

export default Home;