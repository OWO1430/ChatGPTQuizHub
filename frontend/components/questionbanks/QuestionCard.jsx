"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import nookies from "nookies";
import { mutate } from "swr";
import useQuiz from "../../hooks/useQuiz";
import useDeleteQuestion from "../../hooks/useDeleteQuestion";
import Edit from "../../public/edit.png";

function QuestionBankCard({ id }) {
  const router = useRouter();
  const { quiz, isLoading, isError } = useQuiz(id);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [editQuestion, setEditQuestion] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [loading, setLoading] = useState(false);
  const questionRef = useRef();
  const difficultyRef = useRef();
  const optionsRefs = useRef([]);
  const correctAnswerRef = useRef();
  const explanationRef = useRef();
  const deleteQuestion = useDeleteQuestion(quiz?.questions?.[questionIndex]?.id);
  async function editQuestionHandler(e) {
    e.preventDefault();
    setLoading(true);
    const params = {
      question: questionRef.current.value,
      difficulty: difficultyRef.current.value,
      options: optionsRefs.current.map((ref) => ref.value),
      correct_answer: correctAnswerRef.current.value,
      explanation: explanationRef.current.value,
    };
    console.log(params);
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/questions/${quiz?.questions?.[questionIndex]?.id}`,
        params,
        {
          headers: { Authorization: `Bearer ${nookies.get().access_token}` },
        }
      );
      console.log(response);
      mutate([`${process.env.NEXT_PUBLIC_API_URL}/quizzes/${id}/detail`]);
    } catch (error) {
      if (error?.response?.status === 403) {
        Swal.fire("帳號已過期", "請重新登入", "error");
        router.push("/login");
      }
      if (error?.response?.status >= 500 && error?.response?.status < 600) {
        Swal.fire("Server Error", "請稍後再試或和我們的技術團隊聯絡", "error");
      } else {
        Swal.fire("上傳失敗", `${error}`, "error");
      }
    }
    setLoading(false);
    setEditQuestion(false);
  }
  async function deleteQuestionHandler() {
    setLoading(true);
    Swal.fire({
      title: "確定刪除?",
      text: "你無法找回此題目",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "確定刪除",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteQuestion();
        mutate([`${process.env.NEXT_PUBLIC_API_URL}/quizzes/${id}/detail`]);
        if (questionIndex > 0) {
          setQuestionIndex(questionIndex - 1);
        }
        if (questionIndex < quiz?.questions?.length - 1) {
          setQuestionIndex(questionIndex + 1);
        }
      }
    });
    setLoading(false);
  }
  const OptionsItems = quiz?.questions?.[questionIndex]?.options.map((option) => (
    <p key={option.id} className="mt-3 text-lg font-bold">{`(${option.id}) ${option.content}`}</p>
  ));
  const QuestionContent = (
    <div className="">
      <h1 className="mb-5 text-2xl font-bold rounded-lg">{quiz?.questions?.[questionIndex]?.question}</h1>
      <div className="flex items-center">
        <p className="mr-3 text-lg font-bold">難度 :</p>
        <p className="text-lg font-bold">{quiz?.questions?.[questionIndex]?.difficulty}</p>
      </div>
      {OptionsItems}
      <div className="flex items-center h-12 p-4 mt-2 mb-2">
        <button
          type="button"
          onClick={() => {
            setShowAnswer(!showAnswer);
          }}
          className="absolute w-[6.5rem] px-4 py-1 text-base font-bold text-white rounded-md left-5 bg-primary disabled:opacity-50 hover:bg-indigo-500"
        >
          {showAnswer ? "隱藏答案" : "顯示答案"}
        </button>
        {showAnswer && <p className="ml-32 font-bold">({quiz?.questions?.[questionIndex]?.correct_answer})</p>}
      </div>
      <div className="flex items-center h-12 mb-4">
        <button
          type="button"
          onClick={() => {
            setShowExplanation(!showExplanation);
          }}
          className="w-32 px-4 py-1 mr-2 text-base font-bold text-white rounded-md bg-primary disabled:opacity-50 hover:bg-indigo-500"
        >
          {showExplanation ? "隱藏說明" : "顯示說明"}
        </button>
        {showExplanation && (
          <p className="mt-3 break-words whitespace-pre-wrap">{quiz?.questions?.[questionIndex]?.explanation}</p>
        )}
      </div>
      <button
        type="button"
        onClick={() => deleteQuestionHandler(quiz?.questions?.[questionIndex]?.id)}
        disabled={loading}
        className="absolute bottom-3 right-3 text-base font-bold mt-4 text-white bg-primary py-2.5 px-4 rounded-md disabled:opacity-50 hover:bg-red-500"
      >
        刪除題目
      </button>
    </div>
  );
  const OptionsEditItems = quiz?.questions?.[questionIndex]?.options.map((option, index) => (
    <div className="flex items-center mt-4" key={option.id}>
      <p key={option.id} className="mr-3 text-base font-bold ">
        {option.id}.
      </p>
      <input
        type="text"
        defaultValue={option.content}
        required
        ref={(ref) => (optionsRefs.current[index] = ref)}
        className="border rounded-md py-2 px-3.5 min-w-[30rem] text-base outline-none  drop-shadow-md hover:bg-slate-50 focus:drop-shadow-2xl"
      />
    </div>
  ));
  const QuestionEditArea = (
    <form method="post" onSubmit={editQuestionHandler}>
      <input
        type="text"
        ref={questionRef}
        required
        defaultValue={quiz?.questions?.[questionIndex]?.question}
        className="min-w-[30rem] border px-4 py-3 text-base rounded-lg mb-5"
      />
      <div className="flex items-center">
        <p className="mr-3 font-bold">難度 :</p>
        <select
          defaultValue={quiz?.questions?.[questionIndex]?.difficulty}
          ref={difficultyRef}
          required
          className="px-2 py-1 border rounded-lg outline-none"
        >
          <option value="easy" className="rounded-lg">
            簡單
          </option>
          <option value="normal" className="rounded-lg">
            普通
          </option>
          <option value="hard" className="rounded-lg">
            困難
          </option>
        </select>
      </div>
      {OptionsEditItems}
      <div className="flex items-center mt-4 mb-4">
        <p className="mr-3 font-bold">正確答案 :</p>
        <select
          defaultValue={quiz?.questions?.[questionIndex]?.correct_answer}
          ref={correctAnswerRef}
          required
          className="px-2 py-1 border rounded-lg outline-none"
        >
          <option value="1" className="rounded-lg">
            1
          </option>
          <option value="2" className="rounded-lg">
            2
          </option>
          <option value="3" className="rounded-lg">
            3
          </option>
          <option value="4" className="rounded-lg">
            4
          </option>
        </select>
      </div>
      <div className="mb-4">
        <p className="mb-2 font-bold">說明 :</p>
        <textarea
          ref={explanationRef}
          defaultValue={quiz?.questions?.[questionIndex]?.explanation || ""}
          required
          className="resize-none min-w-[60rem] min-h-[5.25rem] mt-2.5 p-2 dark:text-black outline-none rounded-[0.625rem]  drop-shadow-md hover:bg-slate-50 focus:drop-shadow-2xl"
        />
      </div>
      <div>
        <div className="mt-4">
          <button
            type="submit"
            disabled={loading}
            className="text-base font-bold text-white bg-primary font-outfit py-2.5 bg-berry-blue px-[1.875rem] rounded-md mr-[1.125rem] disabled:opacity-50 hover:bg-indigo-500"
          >
            確認
          </button>
          <button
            type="button"
            onClick={() => {
              setEditQuestion(false);
            }}
            className="text-base font-bold text-white font-outfit py-2.5 bg-neutral-300 px-[1.875rem] rounded-md hover:bg-neutral-400"
          >
            取消
          </button>
        </div>
        <button
          type="button"
          onClick={() => deleteQuestionHandler(quiz?.questions?.[questionIndex]?.id)}
          disabled={loading}
          className="absolute bottom-3 right-3 text-base font-bold mt-4 text-white bg-primary py-2.5 px-4 rounded-md disabled:opacity-50 hover:bg-red-500"
        >
          刪除題目
        </button>
      </div>
    </form>
  );
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error loading data</div>;
  }
  return (
    <div className="relative min-w-full p-5 bg-[#f9f9f9] border rounded-lg" key={1}>
      <div className="flex mb-4">
        <p className="mr-3 text-xl font-bold">{`第 ${questionIndex + 1} 題`}</p>
        <button
          type="button"
          hidden={editQuestion === true}
          onClick={() => {
            setEditQuestion(true);
          }}
        >
          <Image src={Edit} alt="edit-icon" width={30} height={30} className="absolute cursor-pointer top-3 right-3 hover:-translate-y-1 hover:scale-110" />
        </button>
      </div>
      {editQuestion ? QuestionEditArea : QuestionContent}
      <div className="">
        <button
          type="button"
          disabled={questionIndex === 0}
          onClick={() => {
            setQuestionIndex(questionIndex - 1);
          }}
          hidden={editQuestion}
          className="text-base font-bold mr-6 text-white bg-primary hover:bg-indigo-500 py-2.5 px-4 rounded-md disabled:opacity-50"
        >
          上一題
        </button>
        <button
          type="button"
          disabled={questionIndex === quiz?.questions?.length - 1}
          onClick={() => {
            setQuestionIndex(questionIndex + 1);
          }}
          hidden={editQuestion}
          className="text-base font-bold mr-6 text-white bg-primary hover:bg-indigo-500 py-2.5 px-4 rounded-md disabled:opacity-50"
        >
          下一題
        </button>
        {questionIndex === quiz?.questions?.length - 1 && (
          <Link
            href="/questionbanks"
            hidden={editQuestion}
            className="text-base font-bold text-white bg-primary py-2.5 px-4 rounded-md disabled:opacity-50 hover:bg-indigo-500"
          >
            回到題庫
          </Link>
        )}
      </div>
    </div>
  );
}

export default QuestionBankCard;
