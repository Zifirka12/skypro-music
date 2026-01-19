import { Bar } from '@/components/Bar/Bar';
import { CenterBlock } from '@/components/CenterBlock/CenterBlock';
import { Nav } from '@/components/Nav/Nav';
import { Sidebar } from '@/components/Sidebar/Sidebar';

export default function MyPlaylist() {
  return (
    <div className="wrapper">
      <div className="container">
        <main className="main">
          <Nav />
          <CenterBlock />
          <Sidebar />
        </main>
        <Bar />
        <footer className="footer"></footer>
      </div>
    </div>
  );
}
