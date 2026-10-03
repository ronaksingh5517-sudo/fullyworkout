"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Home",
      href: "/dashboard",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
          <path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z"/>
        </svg>
      ),
    },
    {
      label: "Food Scan",
      href: "/food-scanner",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
          <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-75 29-147t81-128.5q52-56.5 125-91T475-881q21 0 43 2t45 7q-9 45 6 85t45 66.5q30 26.5 71.5 36.5t85.5-5q-26 59 7.5 113t99.5 56q1 11 1.5 20.5t.5 20.5q0 82-31.5 154.5t-85.5 127q-54 54.5-127 86T480-80Zm-60-480q25 0 42.5-17.5T480-620q0-25-17.5-42.5T420-680q-25 0-42.5 17.5T360-620q0 25 17.5 42.5T420-560Zm-80 200q25 0 42.5-17.5T400-420q0-25-17.5-42.5T340-480q-25 0-42.5 17.5T280-420q0 25 17.5 42.5T340-360ZM260 40q17 0 28.5-11.5T640-360q0-17-11.5-28.5T600-400q-17 0-28.5 11.5T560-360q0 17 11.5 28.5T600-320ZM480-160q122 0 216.5-84T800-458q-50-22-78.5-60T683-603q-77-11-132-66t-68-132q-80-2-140.5 29t-101 79.5Q201-644 180.5-587T160-480q0 133 93.5 226.5T480-160Zm0-324Z"/>
        </svg>
      ),
    },
    {
      label: "Coach",
      href: "/ai-coach",
      isMiddle: true,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" height="26px" viewBox="0 -960 960 960" width="26px" fill="currentColor">
          <path d="M390-120q-51 0-88-35.5T260-241q-60-8-100-53t-40-106q0-21 5.5-41.5T142-480q-11-18-16.5-38t-5.5-42q0-61 40-105.5t99-52.5q3-51 41-86.5t90-35.5q26 0 48.5 10t41.5 27q18-17 41-27t49-10q52 0 89.5 35t40.5 86q59 8 99.5 53T840-560q0 22-5.5 42T818-480q11 18 16.5 38.5T840-400q0 62-40.5 106.5T699-241q-5 50-41.5 85.5T570-120q-25 0-48.5-9.5T480-156q-19 17-42 26.5t-48 9.5Zm130-590v460q0 21 14.5 35.5T570-200q20 0 34.5-16t15.5-36q-21-8-38.5-21.5T550-306q-10-14-7.5-30t16.5-26q14-10 30-7.5t26 16.5q11 16 28 24.5t37 8.5q33 0 56.5-23.5T760-400q0-5-.5-10t-2.5-10q-17 10-36.5 15t-40.5 5q-17 0-28.5-11.5T640-440q0-17 11.5-28.5T680-480q33 0 56.5-23.5T760-560q0-33-23.5-56T680-640q-11 18-28.5 31.5T613-587q-16 6-31-1t-20-23q-5-16 1.5-31t22.5-20q15-5 24.5-18t9.5-30q0-21-14.5-35.5T570-760q-21 0-35.5 14.5T520-710Zm-80 460v-460q0-21-14.5-35.5T390-760q-21 0-35.5 14.5T340-710q0 16 9 29.5t24 18.5q16 5 23 20t2 31q-6 16-21 23t-31 1q-21-8-38.5-21.5T279-640q-32 1-55.5 24.5T200-560q0 33 23.5 56.5T280-480q17 0 28.5 11.5T320-440q0 17-11.5 28.5T280-400q-21 0-40.5-5T203-420q-2 5-2.5 10t-.5 10q0 33 23.5 56.5T280-320q20 0 37-8.5t28-24.5q10-14 26-16.5t30 7.5q14 10 16.5 26t-7.5 30q-14 19-32 33t-39 22q1 20 16 35.5t35 15.5q21 0 35.5-14.5T440-250Zm40-230Z"/>
        </svg>
      ),
    },
    {
      label: "Body Scan",
      href: "/body-scan",
      // 🌟 Clean Body Silhouette Icon taaki kabhi na phate
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor">
          <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"/>
        </svg>
      ),
    },
    {
      label: "Workout",
      href: "/workout",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
          <path d="m826-585-56-56 30-31-128-128-31 30-57-57 30-31q23-23 57-22.5t57 23.5l129 129q23 23 23 56.5T857-615l-31 30ZM346-104q-23 23-56.5 23T233-104L104-233q-23-23-23-56.5t23-56.5l30-30 57 57-31 30 129 129 30-31 57 57-30 30Zm397-336 57-57-303-303-57 57 303 303ZM463-160l57-58-302-302-58 57 303 303Zm-6-234 110-109-64-64-109 110 63 63Zm63 290q-23 23-57 23t-57-23L104-406q-23-23-23-57t23-57l57-57q23-23 56.5-23t56.5 23l63 63 110-110-63-62q-23-23-23-57t23-57l57-57q23-23 56.5-23t56.5 23l303 303q23 23 23 56.5T857-441l-57 57q-23 23-57 23t-57-23l-62-63-110 110 63 63q23 23 23 56.5T577-161l-57 57Z"/>
        </svg>
      ),
    },
  ];

  return (
    <>
      <nav style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        background: "rgba(12, 16, 24, 0.95)",
        backdropFilter: "blur(14px)",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        padding: "8px 12px 20px 12px",
        zIndex: 100,
        boxSizing: "border-box"
      }} aria-label="Bottom Navigation Bar">
        <div style={{
          maxWidth: "540px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center"
        }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            if (item.isMiddle) {
              return (
                <Link key={item.href} href={item.href} style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textDecoration: "none",
                  position: "relative",
                  marginTop: "-24px",
                  flex: 1
                }}>
                  <div className="middle-glow-btn" style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #a67dff, #7a45ff, #38bdf8)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                    boxShadow: "0 8px 20px rgba(122, 69, 255, 0.4)",
                    border: "3px solid #080a0e",
                    transition: "transform 0.2s ease"
                  }}>
                    {item.icon}
                  </div>
                  <span style={{ fontSize: "10.5px", fontWeight: 800, color: "#38bdf8", marginTop: "4px" }}>{item.label}</span>
                </Link>
              );
            }

            return (
              <Link key={item.href} href={item.href} style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
                textDecoration: "none",
                color: isActive ? "#38bdf8" : "#94a3b8",
                transition: "all 0.2s ease",
                flex: 1
              }}>
                <div style={{
                  padding: isActive ? "4px 12px" : "4px 0",
                  background: isActive ? "rgba(56, 189, 248, 0.12)" : "transparent",
                  borderRadius: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s ease"
                }}>
                  {item.icon}
                </div>
                <span style={{ fontSize: "10px", fontWeight: isActive ? 800 : 600, letterSpacing: "0.2px" }}>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <style jsx>{`
        @keyframes pulseGlow {
          0% { box-shadow: 0 0 0 0 rgba(166, 125, 255, 0.5); }
          70% { box-shadow: 0 0 0 12px rgba(166, 125, 255, 0); }
          100% { box-shadow: 0 0 0 0 rgba(166, 125, 255, 0); }
        }
        .middle-glow-btn {
          animation: pulseGlow 2.5s infinite;
        }
        .middle-glow-btn:hover {
          transform: scale(1.08);
        }
      `}</style>
    </>
  );
}