import logo from "../../assets/icons/eventverse-logo.svg";
import { useNavigate } from "react-router-dom";
export default function Logo() {
  const navigate = useNavigate();
  return (
    <div className="flex items-center gap-space-sm flex-shrink-0">
      <a
        onClick={() => {
          navigate("/landingpage");
        }}
        className="cursor-pointer hover:scale-105 transition-transform"
      >
        <img src={logo} alt="EventVerse" className="w-45 h-auto" />
      </a>
    </div>
  );
}
