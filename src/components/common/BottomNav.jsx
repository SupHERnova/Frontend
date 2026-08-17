import { useLocation, useNavigate } from "react-router-dom";

import customerIcon from "../../assets/customer.svg";
import briefingIcon from "../../assets/briefing.svg";
import recommendIcon from "../../assets/recommend.svg";
import recordIcon from "../../assets/record.svg";

function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    {
      label: "고객",
      path: "/customers",
      icon: customerIcon,
    },
    {
      label: "브리핑",
      path: "/messages",
      icon: briefingIcon,
    },
    {
      label: "추천",
      path: "/recommend",
      icon: recommendIcon,
    },
    {
      label: "기록",
      path: "/record",
      icon: recordIcon,
    },
  ];

  return (
    <nav
      className="
        absolute bottom-0 left-0 z-50
        flex h-[82px] w-full
        items-center justify-around
        rounded-t-[22px]
        bg-black
      "
    >
      {navItems.map((item) => {
        const isActive = location.pathname.startsWith(item.path);

        return (
          <button
            key={item.label}
            type="button"
            onClick={() => navigate(item.path)}
            className="
              flex h-full flex-1
              flex-col items-center justify-center
              gap-[5px]
            "
          >
            <img
              src={item.icon}
              alt={item.label}
              className={`h-[22px] w-[22px] object-contain ${
                isActive ? "opacity-100" : "opacity-50"
              }`}
            />

            <span
              className={`text-[9px] leading-none ${
                isActive
                  ? "font-medium text-[#F9FDFF]"
                  : "text-[#F9FDFF]/50"
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

export default BottomNav;