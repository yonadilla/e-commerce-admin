const midtransClient = require('midtrans-client')
import prismadb from "@/lib/prismadb";
import { randomUUID } from "crypto";
import next from "next";
import { NextResponse } from "next/server";


export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const { productIds} = await req.json();

  if (!productIds || productIds.length == 0) {
    return new NextResponse("Product ids is required", { status: 400 });
  }

  const products = await prismadb.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
  });


  const orders = await prismadb.order.update({
    where : {
        id : productIds,
    },
    data : {
        isPaid : true,
    },
    include : {
        orderItem : true
    }
  });

  await prismadb.product.updateMany({
    where : {
      id : {
        in : [...productIds]
      }
    },
    data : {
      isArchived : true,
    }
  })

  return NextResponse.json(null, {status: 200})
}
