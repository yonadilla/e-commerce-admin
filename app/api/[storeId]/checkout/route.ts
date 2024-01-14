const midtransClient = require('midtrans-client')
import prismadb from "@/lib/prismadb";
import { randomUUID } from "crypto";
import next from "next";
import { NextResponse } from "next/server";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT , DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const { productIds, formData, totalPrice} = await req.json();

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

  const uuid = randomUUID()
  
  let snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.SERVER_KEY_MIDTRANS ,
    clientKey: process.env.CLIENT_KEY_MIDTRANS ,
  })

  

  let parameter = {
    transaction_details: {
      order_id: uuid,
      gross_amount : totalPrice ,
    },
    credit_card: {
      secure: true,
    },
    item_details: products.map((product) => ({
      id: product.id,
      price: product.price,
      quantity: 1,
      name: product.name,
      category: product.categoryId,
      merchant_id: product.storeId,
    })),
    customer_details: {
      first_name : formData.name,
      phone : formData.phone,
      billing_address : {
        first_name : formData.name,
        phone : formData.phone,
        address : formData.address,
      }
    },
  }

  const transaction = await snap.createTransaction(parameter)


  const orders = await prismadb.order.create({
    data: {
      storeId: params.storeId,
      isPaid: false,
      phone : formData.phone,
      address : formData.address,
      orderItem: {
        create: productIds.map((productId: string) => ({
          product: {
            connect: {
              id: productId,
            },
          },
        })),
      },
    },
  });


  return NextResponse.json({transaction}, {
    headers : corsHeaders
  })


}
