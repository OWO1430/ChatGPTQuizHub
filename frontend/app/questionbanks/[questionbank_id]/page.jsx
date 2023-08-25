import Navbar from "../../../components/navbar";
import QuestionBankCard from "../../../components/questionbanks/QuestionCard";

function Page({ params }) {
  return (
    <div>
      <Navbar />
      <div className="flex justify-center">
        <QuestionBankCard id={params.questionbank_id} />
      </div>
    </div>
  );
}

export default Page;
