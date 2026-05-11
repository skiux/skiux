import { useState } from 'react';
import Hero from './sections/Hero';
import LabField01 from './sections/LabField01';
import Manifesto from './sections/Manifesto';
import Stats from './sections/Stats';
import LabField02 from './sections/LabField02';
import Now from './sections/Now';
import Reading from './sections/Reading';
import Projects from './sections/Projects';
import Colophon from './sections/Colophon';
import Footer from './sections/Footer';

import TopNav from './components/TopNav';
import StatusBar from './components/StatusBar';
import CommandPalette from './components/CommandPalette';
import ScrollProgress from './components/ScrollProgress';
import CustomCursor from './components/CustomCursor';
import KeyboardHints from './components/KeyboardHints';

export default function App() {
  const [cmdOpen, setCmdOpen] = useState(false);

  return (
    <>
      <CustomCursor />
      <ScrollProgress />
      <TopNav onOpenCommand={() => setCmdOpen(true)} />
      <StatusBar />
      <KeyboardHints />
      <CommandPalette open={cmdOpen} setOpen={setCmdOpen} />

      <main className="bg-bone text-charcoal">
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
      </main>
    </>
  );
}
