"use client";
import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { AiOutlineMail } from "react-icons/ai";
import { format } from "timeago.js";

const ShopAllOrders = ({ isDashboard,ordersData }: { isDashboard: boolean,ordersData:any}) => {
  const columns = [
    { field: "id", headerName: "ID", flex: 0.3 },
    { field: "name", headerName: "Name", flex: isDashboard ? 0.6 : 0.5 },
    ...(isDashboard
      ? []
      : [
          { field: "email", headerName: "Email", flex: 1 },
          { field: "title", headerName: "Prompt Title", flex: 1 },
        ]),
    { field: "price", headerName: "Price", flex: 0.5 },
    ...(isDashboard
      ? [{ field: "created_at", headerName: "Created At", flex: 0.5 }]
      : [
          {
            field: " ",
            headerName: "Email",
            flex: 0.2,
            renderCell: (params: any) => {
              return (
                <a href={`mailto:${params.row.email}`}>
                  <AiOutlineMail
                    className="dark:text-white text-black"
                    size={20}
                  />
                </a>
              );
            },
          },
        ]),
  ];

  const rows: any = [];

  ordersData && ordersData.forEach((order:any) => {
    rows.push({
        id: order.id,
        name: order?.user?.firstName + " " + order?.user?.lastName,
        email: order?.user?.emailAddresses[0]?.emailAddress,
        title: order?.prompt?.name,
        price: "US $" + order?.prompt.price,
        created_at: format(order?.createdAt),
    })
  })

  return (
    <Box m={`${!isDashboard && "20px"}`}>
      <Box
        m={`${!isDashboard && "40px 0 0 0"}`}
        height={isDashboard ? "38vh" : "90vh"}
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
            outline: "none",
            backgroundColor: "transparent",
          },
          "& .css-pqjvzy-MuiSvgIcon-root-MuiSelect-icon": {
            color: "#fff",
          },
          "& .MuiDataGrid-sortIcon": {
            color: "#835DED",
          },
          "& .MuiDataGrid-row": {
            color: "#fff",
            borderBottom: "1px solid #835DED30!important",
            "&:hover": {
              backgroundColor: "#835DED10!important",
            },
          },
          "& .MuiTablePagination-root": {
            color: "#fff",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none!important",
            color: "#fff",
          },
          "& .name-column--cell": {
            color: "#fff",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#835DED20",
            borderBottom: "1px solid #835DED50",
            color: "#fff",
            fontWeight: "600",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: "transparent",
          },
          "& .MuiDataGrid-footerContainer": {
            color: "#fff",
            borderTop: "1px solid #835DED30",
            backgroundColor: "#835DED10",
          },
          "& .MuiCheckbox-root": {
            color: `#835DED !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `#fff !important`,
          },
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: "#835DED20",
          },
          "& .MuiDataGrid-menuIcon": {
            color: "#835DED",
          },
          "& .MuiDataGrid-filterIcon": {
            color: "#835DED",
          },
        }}
      >
        <DataGrid
          checkboxSelection={isDashboard ? false : true}
          rows={rows}
          columns={columns}
          slots={isDashboard ? {} : { toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default ShopAllOrders;
