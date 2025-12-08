import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router";

import MainView from "src/components/layout/MainView";

export default function PageNotFound() {
  return (
    <MainView>
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <h1 className="text-6xl">404</h1>
        <p className="text-xl">Page not found</p>
        <Link to="/" className="flex items-center gap-1">
          <FontAwesomeIcon icon={faChevronLeft} />
          Go to home page
        </Link>
      </div>
    </MainView>
  );
}
