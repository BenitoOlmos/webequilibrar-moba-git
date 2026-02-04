import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Brain, Heart, ShieldCheck, Sparkles, Quote, Fingerprint, Microscope, Users } from 'lucide-react';
import { api } from '../src/services/api';
import { Program } from '../types';

import heroNeuroscience from '../src/assets/images/hero-neuroscience.png';
import heroClinical from '../src/assets/images/hero-clinical.jpg';
import heroInterior from '../src/assets/images/hero-interior.jpg';
import aboutClinicMain from '../src/assets/images/about-clinic-main.jpg';
import aboutClinicDetail from '../src/assets/images/about-clinic-detail.jpg';
import servicePsychiatry from '../src/assets/images/service-psychiatry.jpg';
import servicePsychology from '../src/assets/images/service-psychology.png';
import programAngustia from '../src/assets/images/program-angustia.png';
import programCulpa from '../src/assets/images/program-culpa.png';
import programIrritabilidad from '../src/assets/images/program-irritabilidad.jpg';

const slides = [
   {
      id: 1,
      title: (
         <>
            Resignifica tu bienestar desde la neurociencia <span className="italic text-brand-primary block md:inline relative">y el amor</span>.
         </>
      ),
      subtitle: "Un espacio donde la evidencia clínica se encuentra con la calidez humana. Psiquiatría de precisión y psicología del vínculo.",
      image: heroNeuroscience,
      overlayColor: "from-white/90 via-white/70 to-brand-sand/50"
   },
   {
      id: 2,
      title: (
         <>
            Salud Mental de <span className="text-brand-gold italic">Alta Precisión</span> y Enfoque Humano.
         </>
      ),
      subtitle: "Integramos los últimos avances en neurobiología con terapias de tercera generación para resultados sostenibles.",
      image: heroClinical,
      overlayColor: "from-white/95 via-white/80 to-cyan-50/50"
   },
   {
      id: 3,
      title: (
         <>
            Un Refugio Seguro para <span className="text-brand-dark italic">Sanar y Crecer</span>.
         </>
      ),
      subtitle: "Más que una clínica, somos un ecosistema de transformación diseñado para devolverte tu soberanía emocional.",
      image: heroInterior,
      overlayColor: "from-brand-sand/90 via-white/80 to-white/60"
   }
];

const Home: React.FC = () => {
   const [currentSlide, setCurrentSlide] = useState(0);
   const [programs, setPrograms] = useState<Program[]>([]);
   const [loadingPrograms, setLoadingPrograms] = useState(true);

   useEffect(() => {
      const timer = setInterval(() => {
         setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 6000); // 6 seconds per slide
      return () => clearInterval(timer);
   }, []);

   useEffect(() => {
      const fetchPrograms = async () => {
         try {
            const data = await api.getPrograms();
            setPrograms(data);
         } catch (error) {
            console.error("Failed to load programs", error);
         } finally {
            setLoadingPrograms(false);
         }
      };
      fetchPrograms();
   }, []);

   const resolveProgramImage = (slug: string) => {
      if (slug.includes('angustia')) return programAngustia;
      if (slug.includes('culpa')) return programCulpa;
      if (slug.includes('irritabilidad')) return programIrritabilidad;
      return programAngustia; // Default fallback
   };

   return (
      <div className="animate-fade-in">

         {/* Hero Slider Section */}
         <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-brand-surface">
            {slides.map((slide, index) => (
               <div
                  key={slide.id}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
               >
                  {/* Background Image */}
                  <div className="absolute inset-0">
                     <img src={slide.image} alt="Hero Background" className="w-full h-full object-cover" />
                  </div>
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${slide.overlayColor}`}></div>

                  {/* Content */}
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                     <div className="max-w-4xl mx-auto px-6 text-center pt-16">
                        <span className="block text-brand-primary text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mb-6 md:mb-8 animate-fade-in-down">
                           Centro Clínico Equilibrar®
                        </span>
                        <h1 className="text-4xl md:text-7xl lg:text-8xl font-serif text-brand-heading leading-[1.15] md:leading-[1.1] mb-8 md:mb-10 animate-fade-in-down delay-100">
                           {slide.title}
                        </h1>
                        <p className="text-base md:text-xl text-slate-600 max-w-xl md:max-w-2xl mx-auto leading-relaxed font-light mb-10 md:mb-12 animate-fade-in-down delay-200">
                           {slide.subtitle}
                        </p>
                        <div className="animate-fade-in-down delay-300 pb-10">
                           <button
                              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                              className="group inline-flex items-center text-xs md:text-sm font-bold tracking-widest uppercase border-b border-brand-heading pb-2 hover:text-brand-primary hover:border-brand-primary transition-all p-2"
                           >
                              Conocer el Método <ArrowRight size={16} className="ml-2 group-hover:translate-x-2 transition-transform text-brand-gold" />
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            ))}

            {/* Slider Indicators */}
            <div className="absolute bottom-12 left-0 right-0 z-30 flex justify-center gap-4">
               {slides.map((_, index) => (
                  <button
                     key={index}
                     onClick={() => setCurrentSlide(index)}
                     className={`w-2 h-2 rounded-full transition-all duration-500 ${index === currentSlide ? 'bg-brand-primary w-8' : 'bg-brand-text/20 hover:bg-brand-text/40'}`}
                     aria-label={`Ir a la diapositiva ${index + 1}`}
                  />
               ))}
            </div>
         </section>

         {/* NEW SECTION: About / Philosophy */}
         <section id="about" className="py-24 bg-brand-sand/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                  <div className="order-2 lg:order-1 animate-fade-in-down delay-100">
                     <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-brand-primary/10 mb-6">
                        <Sparkles size={14} className="text-brand-gold" />
                        <span className="text-[10px] font-bold tracking-widest uppercase text-brand-text">El Método Equilibrar</span>
                     </div>
                     <h2 className="text-4xl md:text-5xl font-serif text-brand-heading mb-8 leading-tight">
                        Una arquitectura clínica para la <span className="italic text-brand-primary">restauración humana</span>.
                     </h2>
                     <div className="space-y-8">
                        <div className="flex gap-4">
                           <div className="w-12 h-12 rounded-sm bg-white flex items-center justify-center shrink-0 shadow-sm text-brand-primary border border-brand-primary/10">
                              <Brain size={24} />
                           </div>
                           <div>
                              <h3 className="font-serif text-xl text-brand-heading mb-2">Neurociencia Afectiva</h3>
                              <p className="text-slate-500 font-light leading-relaxed text-sm">
                                 No solo tratamos síntomas; regulamos sistemas. Entendemos la salud mental desde la biología del sistema nervioso y su búsqueda constante de seguridad.
                              </p>
                           </div>
                        </div>
                        <div className="flex gap-4">
                           <div className="w-12 h-12 rounded-sm bg-white flex items-center justify-center shrink-0 shadow-sm text-brand-primary border border-brand-primary/10">
                              <Heart size={24} />
                           </div>
                           <div>
                              <h3 className="font-serif text-xl text-brand-heading mb-2">Vínculo Seguro</h3>
                              <p className="text-slate-500 font-light leading-relaxed text-sm">
                                 La herida ocurre en relación, y la sanación también. Nuestro equipo clínico ofrece una presencia sintonizada que permite reparar patrones de apego.
                              </p>
                           </div>
                        </div>
                        <div className="flex gap-4">
                           <div className="w-12 h-12 rounded-sm bg-white flex items-center justify-center shrink-0 shadow-sm text-brand-primary border border-brand-primary/10">
                              <ShieldCheck size={24} />
                           </div>
                           <div>
                              <h3 className="font-serif text-xl text-brand-heading mb-2">Rigor Ético</h3>
                              <p className="text-slate-500 font-light leading-relaxed text-sm">
                                 Privacidad absoluta, formación continua y una mirada libre de juicios. Tu historia es sagrada y la tratamos con el respeto que merece.
                              </p>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="order-1 lg:order-2 animate-fade-in-down delay-200">
                     <div className="relative">
                        <div className="aspect-[4/5] rounded-sm overflow-hidden shadow-luxury">
                           <img
                              src={aboutClinicMain}
                              alt="Consulta Clínica Equilibrar"
                              className="w-full h-full object-cover"
                           />
                        </div>
                        <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-white p-4 shadow-luxury hidden md:block">
                           <img
                              src={aboutClinicDetail}
                              alt="Detalle"
                              className="w-full h-full object-cover"
                           />
                        </div>
                     </div>
                  </div>

               </div>
            </div>
         </section>

         {/* Services Section */}
         <section className="py-20 md:py-32 bg-white relative">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
               <div className="flex flex-col md:flex-row justify-between items-end mb-12 md:mb-20 border-b border-brand-sand pb-8 gap-4 md:gap-0">
                  <h2 className="text-3xl md:text-5xl font-serif text-brand-heading">Servicios Clínicos</h2>
                  <p className="text-brand-gold text-xs md:text-sm tracking-wide uppercase font-medium">Presencial & Online</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
                  {/* Psychiatry */}
                  <Link to="/psiquiatria" className="group block animate-fade-in-down" style={{ animationDelay: '0.2s' }}>
                     <div className="relative aspect-[4/3] md:h-[400px] bg-brand-sand mb-6 md:mb-8 overflow-hidden rounded-sm shadow-luxury">
                        <img
                           src={servicePsychiatry}
                           alt="Psiquiatría"
                           className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 grayscale group-hover:grayscale-0 opacity-90"
                           loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                     </div>
                     <div className="flex justify-between items-start gap-4">
                        <div>
                           <h3 className="text-xl md:text-2xl font-serif text-brand-heading mb-2 md:mb-3 group-hover:text-brand-primary transition-colors">Psiquiatría y Diagnóstico</h3>
                           <p className="text-sm md:text-base text-slate-500 leading-relaxed max-w-sm">Diagnóstico transdisciplinario y regulación neurobiológica.</p>
                        </div>
                        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-brand-light group-hover:bg-brand-primary group-hover:text-white transition-all shrink-0">
                           <ArrowRight size={16} className="text-brand-heading group-hover:text-white group-hover:translate-x-1 transition-all" />
                        </div>
                     </div>
                  </Link>

                  {/* Psychology */}
                  <Link to="/psicologia" className="group block md:mt-24 animate-fade-in-down" style={{ animationDelay: '0.4s' }}>
                     <div className="relative aspect-[4/3] md:h-[400px] bg-brand-sand mb-6 md:mb-8 overflow-hidden rounded-sm shadow-luxury">
                        <img
                           src={servicePsychology}
                           alt="Psicología"
                           className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 grayscale group-hover:grayscale-0 opacity-90"
                           loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                     </div>
                     <div className="flex justify-between items-start gap-4">
                        <div>
                           <h3 className="text-xl md:text-2xl font-serif text-brand-heading mb-2 md:mb-3 group-hover:text-brand-primary transition-colors">Psicología y Vínculo</h3>
                           <p className="text-sm md:text-base text-slate-500 leading-relaxed max-w-sm">Terapia centrada en la regulación somática y la seguridad.</p>
                        </div>
                        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-brand-light group-hover:bg-brand-primary group-hover:text-white transition-all shrink-0">
                           <ArrowRight size={16} className="text-brand-heading group-hover:text-white group-hover:translate-x-1 transition-all" />
                        </div>
                     </div>
                  </Link>
               </div>
            </div>
         </section>

         {/* Programs Section */}
         <section id="programs" className="py-20 md:py-32 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
               <div className="text-center max-w-2xl mx-auto mb-16 md:mb-24">
                  <span className="text-brand-gold text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase block mb-4 md:mb-6 animate-fade-in-down">Programas High-Ticket</span>
                  <h2 className="text-3xl md:text-5xl font-serif text-brand-heading mb-6 md:mb-8 animate-fade-in-down" style={{ animationDelay: '0.2s' }}>Procesos de Reprogramación</h2>
                  <p className="text-slate-500 text-base md:text-lg font-light leading-relaxed animate-fade-in-down" style={{ animationDelay: '0.3s' }}>
                     Intervenciones intensivas de 4 semanas diseñadas para desactivar patrones limitantes y restaurar tu soberanía emocional.
                  </p>
               </div>

               <div className="space-y-16 md:space-y-24 mb-24">

                  {loadingPrograms && (
                     <div className="text-center py-12 text-gray-400">
                        Cargando programas disponibles...
                     </div>
                  )}

                  {!loadingPrograms && programs.map((program, index) => (
                     <div
                        key={program.id}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center animate-fade-in-down"
                        style={{ animationDelay: `${0.4 + (index * 0.2)}s` }}
                     >
                        {/* Visual Order Zig-Zag */}
                        <div className={`order-1 ${index % 2 === 1 ? 'lg:order-2 lg:pl-12' : 'lg:order-1'}`}>
                           <div className="relative aspect-square md:aspect-square overflow-hidden rounded-sm shadow-luxury group border-4 border-white">
                              <img
                                 src={resolveProgramImage(program.slug)}
                                 alt={program.title}
                                 className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                 loading="lazy"
                              />
                              {index === 2 ? (
                                 <div className="absolute top-4 right-4 bg-brand-gold/90 backdrop-blur px-3 py-1 rounded-sm text-xs font-bold text-white shadow-sm flex items-center gap-1">
                                    <Sparkles size={10} /> SOLO 5 CUPOS
                                 </div>
                              ) : (
                                 <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-sm text-xs font-bold text-brand-heading shadow-sm">
                                    PREMIUM
                                 </div>
                              )}
                           </div>
                        </div>

                        <div className={`order-2 ${index % 2 === 1 ? 'lg:order-1 lg:pr-12' : 'lg:order-2 lg:pl-12'}`}>
                           <span className="block text-brand-primary text-xs tracking-widest uppercase mb-3">{program.subtitle}</span>
                           <h3 className="text-3xl md:text-5xl font-serif text-brand-heading mb-4 md:mb-6">{program.title}</h3>
                           <p className="text-base md:text-lg text-slate-500 mb-8 leading-relaxed font-light">
                              {program.shortDescription}
                           </p>
                           <Link
                              to={`/${program.slug}`}
                              className="w-full md:w-auto inline-flex items-center justify-center px-10 py-4 bg-brand-heading text-white rounded-lg hover:bg-brand-primary transition-all duration-300 shadow-lg hover:shadow-cyan-200/50 text-sm font-bold tracking-wide transform hover:translate-y-1"
                           >
                              Ver Detalle del Programa
                           </Link>
                        </div>
                     </div>
                  ))}

               </div>
            </div>
         </section>

         {/* NEW SECTION: Testimonials / Voices of Transformation */}
         <section className="py-24 bg-brand-sand/30 relative">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
               <div className="text-center mb-16 animate-fade-in-down">
                  <span className="text-brand-primary text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase">Impacto Real</span>
                  <h2 className="text-3xl md:text-4xl font-serif text-brand-heading mt-4">Voces de Transformación</h2>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                  <div className="bg-white p-8 md:p-10 rounded-sm shadow-luxury border border-white hover:border-brand-primary/20 transition-all duration-300 group animate-fade-in-down" style={{ animationDelay: '0.2s' }}>
                     <Quote className="text-brand-gold mb-6 opacity-50" size={32} />
                     <p className="text-lg font-serif italic text-slate-600 mb-6 leading-relaxed">
                        "Nunca sentí que me 'arreglaban', sino que me entendían. Por primera vez en años, la ansiedad dejó de ser el ruido de fondo de mi vida."
                     </p>
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-sand rounded-full flex items-center justify-center text-xs font-bold text-brand-heading">M.A</div>
                        <div>
                           <p className="text-xs font-bold text-brand-heading uppercase tracking-wider">Paciente Clínica</p>
                           <p className="text-[10px] text-slate-400">Programa Angustia</p>
                        </div>
                     </div>
                  </div>

                  <div className="bg-white p-8 md:p-10 rounded-sm shadow-luxury border border-white hover:border-brand-primary/20 transition-all duration-300 group animate-fade-in-down" style={{ animationDelay: '0.3s' }}>
                     <Quote className="text-brand-gold mb-6 opacity-50" size={32} />
                     <p className="text-lg font-serif italic text-slate-600 mb-6 leading-relaxed">
                        "La mezcla de precisión técnica y calidez humana es única. Equilibrar no es solo terapia, es una reeducación emocional completa."
                     </p>
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-sand rounded-full flex items-center justify-center text-xs font-bold text-brand-heading">F.R</div>
                        <div>
                           <p className="text-xs font-bold text-brand-heading uppercase tracking-wider">Paciente Clínica</p>
                           <p className="text-[10px] text-slate-400">Psiquiatría Integral</p>
                        </div>
                     </div>
                  </div>

                  <div className="bg-white p-8 md:p-10 rounded-sm shadow-luxury border border-white hover:border-brand-primary/20 transition-all duration-300 group animate-fade-in-down" style={{ animationDelay: '0.4s' }}>
                     <Quote className="text-brand-gold mb-6 opacity-50" size={32} />
                     <p className="text-lg font-serif italic text-slate-600 mb-6 leading-relaxed">
                        "Entender mi culpa desde la neurociencia me liberó. Dejé de luchar contra mí misma y empecé a usar mi energía para vivir."
                     </p>
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-sand rounded-full flex items-center justify-center text-xs font-bold text-brand-heading">C.S</div>
                        <div>
                           <p className="text-xs font-bold text-brand-heading uppercase tracking-wider">Paciente Clínica</p>
                           <p className="text-[10px] text-slate-400">Programa Culpa</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* NEW SECTION: Trust / Guarantee */}
         <section className="py-20 bg-brand-light/30 border-t border-brand-primary/5">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">

                  <div className="flex flex-col items-center md:items-start animate-fade-in-down" style={{ animationDelay: '0.1s' }}>
                     <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-md mb-6 text-brand-primary">
                        <Microscope size={24} strokeWidth={1.5} />
                     </div>
                     <h3 className="font-serif text-xl text-brand-heading mb-3">Evidencia Clínica</h3>
                     <p className="text-sm text-slate-500 leading-relaxed font-light">
                        Protocolos basados en los últimos avances de la neurociencia afectiva y la teoría polivagal. Sin improvisación.
                     </p>
                  </div>

                  <div className="flex flex-col items-center md:items-start animate-fade-in-down" style={{ animationDelay: '0.2s' }}>
                     <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-md mb-6 text-brand-primary">
                        <Fingerprint size={24} strokeWidth={1.5} />
                     </div>
                     <h3 className="font-serif text-xl text-brand-heading mb-3">Privacidad Blindada</h3>
                     <p className="text-sm text-slate-500 leading-relaxed font-light">
                        Plataformas encriptadas y ética rigurosa. Tu proceso es un espacio sagrado protegido por el secreto profesional.
                     </p>
                  </div>

                  <div className="flex flex-col items-center md:items-start animate-fade-in-down" style={{ animationDelay: '0.3s' }}>
                     <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-md mb-6 text-brand-primary">
                        <Users size={24} strokeWidth={1.5} />
                     </div>
                     <h3 className="font-serif text-xl text-brand-heading mb-3">Acompañamiento Real</h3>
                     <p className="text-sm text-slate-500 leading-relaxed font-light">
                        No eres un número. Nuestro equipo mantiene un seguimiento cercano y humano durante todo tu programa.
                     </p>
                  </div>

               </div>
            </div>
         </section>

      </div>
   );
};

export default Home;