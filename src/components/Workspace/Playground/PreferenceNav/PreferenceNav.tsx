import { useState, useEffect } from "react";
import {
  AiOutlineFullscreen,
  AiOutlineFullscreenExit,
  AiOutlineSetting,
} from "react-icons/ai";
import { ISettings } from "../Playground";
import SettingsModal from "@/components/Modals/SettingsModal";
import { BsChevronDown } from "react-icons/bs";

type PreferenceNavProps = {
  settings: ISettings;
  setSettings: React.Dispatch<React.SetStateAction<ISettings>>;
  selectedLanguage: string;
  setSelectedLanguage: React.Dispatch<React.SetStateAction<string>>;
};

const PreferenceNav: React.FC<PreferenceNavProps> = ({
  setSettings,
  settings,
  selectedLanguage,
  setSelectedLanguage,
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreen = () => {
    if (isFullScreen) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
    setIsFullScreen(!isFullScreen);
  };

  useEffect(() => {
    function exitHandler(e: any) {
      if (!document.fullscreenElement) {
        setIsFullScreen(false);
        return;
      }
      setIsFullScreen(true);
    }

    if (document.addEventListener) {
      document.addEventListener("fullscreenchange", exitHandler);
      document.addEventListener("webkitfullscreenchange", exitHandler);
      document.addEventListener("mozfullscreenchange", exitHandler);
      document.addEventListener("MSFullscreenChange", exitHandler);
    }
  }, [isFullScreen]);

  const [isOpen, setIsOpen] = useState(false);
  //const [selectedLanguage, setSelectedLanguage] = useState("JavaScript");

  const languages = ["JavaScript", "C++", "Java", "Python"];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectLanguage = (language: string) => {
    setSelectedLanguage(language);
    setIsOpen(false);
  };

  return (
    <div className="flex items-center justify-between bg-dark-layer-2 h-11 w-full">
      {/* div for language support button */}
      {/* <div className="flex items-center text-white">
        <button className="flex cursor-pointer items-center rounded focus:outline-none bg-dark-fill-3 text-dark-label-2 hover:bg-dark-fill-2  px-2 py-1.5 font-medium">
          <div className="flex items-center px-1">
            <div className="text-xs text-label-2 dark:text-dark-label-2">
              JavaScript
            </div>
          </div>
        </button>
      </div> */}

      <div className="relative">
        <button
          className="flex cursor-pointer items-center rounded focus:outline-none bg-dark-fill-3 text-dark-label-2 hover:bg-dark-fill-2 px-2 py-1.5 font-medium"
          onClick={toggleDropdown}
        >
          <div className="flex items-center px-1">
            <div className="text-xs text-label-2 dark:text-dark-label-2">
              {selectedLanguage}
            </div>

            <BsChevronDown />
          </div>
        </button>
        {isOpen && (
          <ul className="absolute left-0 mt-2 py-1 bg-dark-fill-3 rounded-lg shadow-lg z-10">
            {languages.map((language) => (
              <li key={language}>
                <button
                  className="block w-full px-4 py-2 text-sm text-label-2 dark:text-dark-label-2 hover:bg-dark-fill-2 hover:text-white focus:outline-none"
                  onClick={() => selectLanguage(language)}
                >
                  {language}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* settings icon div */}
      <div className="flex items-center m-2">
        {/* css class preferenceBtn group is custom made */}
        <button
          className="preferenceBtn group"
          onClick={() =>
            setSettings({ ...settings, settingsModalIsOpen: true })
          }
        >
          <div className="h-4 w-4 text-dark-gray-6 font-bold text-lg">
            <AiOutlineSetting />
          </div>
          <div className="preferenceBtn-tooltip">Settings</div>
        </button>

        {/* full screen icon div */}
        <button className="preferenceBtn group" onClick={handleFullScreen}>
          <div className="h-4 w-4 text-dark-gray-6 font-bold text-lg">
            {/* checking fullscreen or not */}
            {!isFullScreen ? (
              <AiOutlineFullscreen />
            ) : (
              <AiOutlineFullscreenExit />
            )}
          </div>
          <div className="preferenceBtn-tooltip">Full Screen</div>
        </button>
      </div>
      {settings.settingsModalIsOpen && (
        <SettingsModal settings={settings} setSettings={setSettings} />
      )}
    </div>
  );
};
export default PreferenceNav;
