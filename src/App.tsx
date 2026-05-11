import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Notes from './pages/Notes';
import Lab from './pages/Lab';
import Work from './pages/Work';

import TopNav from './components/TopNav';
import StatusBar from './components/StatusBar';
import CommandPalette from './components/CommandPalette';
import ScrollProgress from './components/ScrollProgress';
import CustomCursor from './components/CustomCursor';
import KeyboardHints from './components/KeyboardHints';
import SmoothScroll from './components/SmoothScroll';

function Shell() {
  const [cmdOpen, setCmdOpen] = useState(false);
  return (
    <>
      <SmoothScroll />
      <CustomCursor />
      <ScrollProgress />
      <TopNav onOpenCommand={() => setCmdOpen(true)} />
      <StatusBar />
      <KeyboardHints />
      <CommandPalette open={cmdOpen} setOpen={setCmdOpen} />

      <main className="bg-bone text-charcoal">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/lab" element={<Lab />} />
          <Route path="/work" element={<Work />} />
        </Routes>
      </main>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  );
}
