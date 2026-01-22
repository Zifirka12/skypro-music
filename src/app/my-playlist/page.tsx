import { Bar } from '@/components/Bar/Bar';
import { CenterBlock } from '@/components/CenterBlock/CenterBlock';
import { Navigation } from '@/components/Navigation/Navigation';
import { Sidebar } from '@/components/Sidebar/Sidebar';

export default function MyPlaylist() {
  return (
    <div className="wrapper">
      <div className="container">
        <main className="main">
          <Navigation />
          <CenterBlock />
          <Sidebar />
        </main>
        <Bar />
        <footer className="footer"></footer>
      </div>
    </div>
  );
}
