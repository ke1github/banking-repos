import React from "react";

interface HeaderBoxProps {
  type: string;
  title: string;
  user?: string;
  subtext: string;
}

export const HeaderBox: React.FC<HeaderBoxProps> = ({
  type,
  title,
  user,
  subtext,
}) => (
  <div className="header-box">
    <h1 className="header-box-title">
      {title}
      {type === "greeting" && (
        <span className="!text-bankGradient"> &nbsp; {user} </span>
      )}
    </h1>
    <p className="header-box-subtext">{subtext}</p>
  </div>
);
