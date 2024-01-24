const midtransClient = require('midtrans-client')
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
) {
  const body = await req.json();


  let orderId = body.order_id;
  let transactionStatus = body.transaction_status;
  let fraudStatus = body.fraud_status;
  
  console.log(`Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`);
    
    if (transactionStatus === 'capture' || transactionStatus == 'settlement') {
      if(fraudStatus == 'accept') {
        await prismadb.order.update({
          where :{
            id : orderId,
          },
          data : {
            isPaid : true,
          },
          include : {
            orderItem : true
          }
        })
      }
    }

  

  return NextResponse.json(null, {
    status : 200,
  })
}
