import * as React from "react";
import { useTheme } from "next-themes";
import {MoonOutlined, SunOutlined} from "@ant-design/icons";

export function ModeToggleAfterLogin() {
    const { theme, setTheme } = useTheme();
    const [isDark, setIsDark] = React.useState(false);

    React.useEffect(() => {
        setIsDark(theme === "dark");
    }, [theme]);

    const toggleTheme = () => {
        setTheme(isDark ? "light" : "dark");
        setIsDark(!isDark);
    };

    return (
        <div
            className="cursor-pointer border-0 rounded-[6px] flex justify-center items-cente mr-0 gap-2"
            onClick={toggleTheme}
        >
            {isDark ? (
                <>
                    <SunOutlined />
                </>
            ) : (
                <>
                    <MoonOutlined  className="text-primary-color"/>
                </>
            )}
        </div>
    );
}