'use client';

import Sidebar from './Sidebar';
import HorizontalNav from './HorizontalNav';

export default function Navigation() {
  return (
    <div className="mission-control-nav-system">
      <Sidebar />
      <HorizontalNav />
    </div>
  );
}