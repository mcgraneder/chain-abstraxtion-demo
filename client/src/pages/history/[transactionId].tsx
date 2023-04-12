import type { NextPage } from "next";
import { Layout } from "../../layouts";
import TransactionIdTable from "@/components/Transactions/TransactionIdTable";
import TransactionId from "@/components/Transactions/TransactionId";

const TransactionsPage: NextPage = () => {
  return (
    <Layout>
      <TransactionId />
    </Layout>
  );
};

export default TransactionsPage;
