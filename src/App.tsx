import Hero from './sections/Hero';
import Manifesto from './sections/Manifesto';
import Inverted from './sections/Inverted';
import Now from './sections/Now';
import Projects from './sections/Projects';
import Colophon from './sections/Colophon';
import Footer from './sections/Footer';
import ScrollProgress from './components/ScrollProgress';
import CustomCursor from './components/CustomCursor';
import KeyboardHints from './components/KeyboardHints';

export default function App() {
  return (
    <>
      <ScrollProgress />
      <CustomCursor />
      <KeyboardHints />
      <main className="bg-bone text-charcoal">
        <Hero />
        <Manifesto />
        <Inverted />
        <Now />
        <Projects />
        <Colophon />
        <Footer />
      </main>
    </>
  );
}
