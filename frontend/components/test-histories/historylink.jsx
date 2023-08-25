import React, { useEffect } from "react";
import Link from "next/link";
import Progressbar from "./progressbar";

function HistoryLink({
  title, createdAt, animationkey, percentage, quizId
}) {
  useEffect(() => { console.log(quizId); }, []);
  return (
    <div className="p-4 bg-white rounded w-[70vw] h-30 truncate m-4">
      <div className="flex">
        <div className="max-w-xl mb-2 overflow-hidden text-xl font-semibold truncate">
          {title}
        </div>
        <div className="ml-auto">
          <Progressbar percentage={percentage} animationkey={animationkey} />
        </div>
      </div>
      <div className="flex mt-4">
        <p className="ml-6 text-black">{createdAt}</p>
        <Link href={`/quiz/${quizId}`} passHref className="mt-auto ml-auto">
          <div className="block bg-[#84C1FF] text-white px-4 py-1 rounded-md hover:bg-[#638ace]">測驗傳送門</div>
        </Link>
      </div>
    </div>
  );
}

export default HistoryLink;
