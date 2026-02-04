import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import ServiceDetail from './pages/ServiceDetail';
import ProgramDetail from './pages/ProgramDetail';

// ScrollToTop component to handle scroll reset on route change
const ScrollToTop = () => {
  const { pathname } = React.useMemo(() => new URL(window.location.href), [window.location.href]);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />

        {/* SERVICES - Hydrated via API */}
        <Route
          path="/psiquiatria"
          element={
            <Layout>
              <ServiceDetail slug="psiquiatria" />
            </Layout>
          }
        />

        <Route
          path="/psicologia"
          element={
            <Layout>
              <ServiceDetail slug="psicologia" />
            </Layout>
          }
        />

        {/* PROGRAMS - Hydrated via API */}
        <Route
          path="/programa-angustia"
          element={
            <Layout showFooter={false}>
              <ProgramDetail slug="programa-angustia" />
            </Layout>
          }
        />

        <Route
          path="/programa-culpa"
          element={
            <Layout showFooter={false}>
              <ProgramDetail slug="programa-culpa" />
            </Layout>
          }
        />

        <Route
          path="/programa-irritabilidad"
          element={
            <Layout showFooter={false}>
              <ProgramDetail slug="programa-irritabilidad" />
            </Layout>
          }
        />

      </Routes>
    </Router>
  );
};

export default App;