import { GENERAL_BIO } from "@/lib/constants";
import { User } from "@/lib/types";
import { NameTransition } from "../name";

interface HeaderProps {
  userData: User;
}

const Header = ({ userData }: HeaderProps) => (
  <header className="mb-6 max-w-4xl mx-auto px-4 pt-12 sm:px-8 sm:mb-8 flex justify-between items-center">
    <div>
      <NameTransition userData={userData} />
      <div className="flex space-x-4 mt-3 text-sm text-gray-600">
        <span>{userData?.bio || GENERAL_BIO}</span>
      </div>
    </div>
  </header>
);

export default Header;
