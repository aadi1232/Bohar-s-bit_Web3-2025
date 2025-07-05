"use client";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";

type PromptsDataTypes = {
  id: string;
  name: string;
  price: string;
  rating: number;
  purchased?: number;
  orders?: any[];
  status: string;
};

const AllPrompts = ({
  promptsData,
  isDashboard,
}: {
  promptsData: any;
  isDashboard?: boolean;
}) => {
  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "name", headerName: "Prompts Title", flex: 0.8 },
    { field: "price", headerName: "Prompts Price", flex: 0.5 },
    { field: "rating", headerName: "Ratings", flex: 0.5 },
    { field: "purchased", headerName: "Purchased", flex: 0.5 },
    {
      field: "status",
      headerName: "Status",
      flex: 0.5,
    },
  ];

  const rows: Array<PromptsDataTypes> = [];

  promptsData?.forEach((item: PromptsDataTypes) => {
    rows.push({
      id: item.id,
      name: item.name,
      price: item.price + " ETH",
      rating: item.rating,
      purchased: item.orders?.length,
      status: "Live",
    });
  });

  return (
    <>
      <Box m="20px">
        <Box
          m="40px 0 0 0"
          height={isDashboard ? "35vh" : "90vh"}
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
          <DataGrid checkboxSelection rows={rows} columns={columns} />
        </Box>
      </Box>
    </>
  );
};

export default AllPrompts;
