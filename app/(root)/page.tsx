import React from "react";
import { HeaderBox } from "@/components/HeaderBox";
import TotalBalanceBox from "@/components/TotalBalanceBox";

const HOME = () => {
  const loggedIn = { firstName: "Pawan" };
  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          {/* You can add more components or content here */}
          <HeaderBox
            type="greeting"
            title="Welcome"
            user={loggedIn.firstName || "Guest"}
            subtext={
              "Access your banking dashboard and manage your finances effortlessly."
            }
          />
          <TotalBalanceBox
            accounts={[]}
            totalBanks={0}
            totalCurrentBalance={0}
          />
        </header>
      </div>
    </section>
  );
};

export default HOME;
