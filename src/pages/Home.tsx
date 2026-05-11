import Hero from '../sections/Hero';
import LabField01 from '../sections/LabField01';
import Manifesto from '../sections/Manifesto';
import Stats from '../sections/Stats';
import LabField02 from '../sections/LabField02';
import Now from '../sections/Now';
import Reading from '../sections/Reading';
import Projects from '../sections/Projects';
import Colophon from '../sections/Colophon';
import Footer from '../sections/Footer';

export default function Home() {
  return (
    <>
      <Hero />
      <LabField01 />
      <Manifesto />
      <Stats />
      <LabField02 />
      <Now />
      <Reading />
      <Projects />
      <Colophon />
      <Footer />
    </>
  );
}
