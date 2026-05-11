import Placeholder from './Placeholder';

export default function Work() {
  return (
    <Placeholder
      title="Work."
      italic="indexed when ready."
      blurb="A KV store with Raft + LSM. A small MapReduce-flavored runtime. Distributed tracing, end to end. None of it is ready to read yet — when it is, it goes here, with prose."
      image="/img/work-architecture.jpg"
      credit="photo · mike wilson / unsplash"
    />
  );
}
