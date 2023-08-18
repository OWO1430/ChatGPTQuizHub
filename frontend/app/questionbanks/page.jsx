"use client";

import QuestionBankSideBar from "../../components/questionbanks/QuestionBankSideBar";
import QuestionsBanksCard from "../../components/questionbanks/QuestionBankCard";
import Navbar from "../../components/navbar";

const MockData = [
  {
    id: 1,
    title: "React 是什麼?",
  },
  {
    id: 2,
    title: "Docker 是什麼?",
  },
  {
    id: 3,
    title:
      ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",
  },
];
const questionsBankItems = MockData.map((questionsBank) => (
  <QuestionsBanksCard questionsBank={questionsBank} key={questionsBank.id} />
));
function Page() {
  return (
    <div>
      <Navbar />
      <div className="flex justify-center mt-20">
        <div className="mr-10">
          <QuestionBankSideBar />
        </div>
        <div className="flex flex-col min-w-[60rem] rounded-lg bg-white border p-4 mr-6">
          <h1 className="mb-5 text-2xl font-bold leading-6">題庫</h1>
          {questionsBankItems}
        </div>
      </div>
    </div>
  );
}

export default Page;
