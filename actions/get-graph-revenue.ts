import prismadb from "@/lib/prismadb";


interface GraphData {
  name : string;
  total : number;
}


export const getGraphRevenue = async (storeId: string) => {
  const paidOrders = await prismadb.order.findMany({
    where: {
      storeId,
      isPaid: true,
    },
    include: {
      orderItem: {
        include: {
          product: true,
        },
      },
    },
  });

  const monthlyRevenue: { [key: number]: number } = {};

  for (const order of paidOrders) {
    const month = order.createdAt.getMonth();
    let revenueForOrder = 0;

    for (const item of order.orderItem) {
      revenueForOrder += item.product.price.toNumber();
    }

    monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revenueForOrder;
  }

  const graphData : GraphData[] = [
    { name : "Jan" , total : 0 },
    { name : "Feb" , total : 0 },
    { name : "Mar" , total : 0 },
    { name : "Apr" , total : 0 },
    { name : "Mei" , total : 0 },
    { name : "Jun" , total : 0 },
    { name : "Jul" , total : 0 },
    { name : "Ags" , total : 0 },
    { name : "Sep" , total : 0 },
    { name : "Oct" , total : 0 },
    { name : "Nov" , total : 0 },
    { name : "Des" , total : 0 }
  ]

  for (const month in monthlyRevenue) {
    graphData[parseInt(month)].total = monthlyRevenue[parseInt(month)];
  }
  return graphData;
};
