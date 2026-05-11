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
import SectionBand from '../components/SectionBand';

export default function Home() {
  return (
    <>
      <Hero />
      <LabField01 />
      <Manifesto />
      <SectionBand
        image="/img/accent-tape.jpg"
        caption="— quiet machinery, between sections"
        align="right"
      />
      <Stats />
      <LabField02 />
      <Now />
      <SectionBand
        image="/img/accent-paper.jpg"
        height="h-[45vh]"
        caption="— paper, where ideas first land"
        align="left"
      />
      <Reading />
      <Projects />
      <Colophon />
      <Footer />
    </>
  );
}
