"use client";

import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { OrderColumn, columns } from "./columns";


interface OrderClientProps {
  data : OrderColumn[]
}

export const OrderClient : React.FC<OrderClientProps> = ({
  data
}) => {
  return (
    <>
        <Heading
          title={`Orders (${data.length})`}
          descriptions="Menage order for your store"
        />
      <Separator />
      <DataTable searchKey="products" columns={columns} data={data}/>
    </>
  );
};
