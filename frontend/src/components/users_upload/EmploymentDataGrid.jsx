import React from "react";
import Box from "@mui/material/Box";
import {
  DataGrid,
  GridToolbar,
  gridFilteredSortedRowIdsSelector,
  selectedGridRowsSelector,
} from "@mui/x-data-grid";
import useGetAllEmployments from "../../hooks/all_profiles/useGetAllEmployments";

const EmploymentDataGrid = () => {
  const { data: allEmployments, isLoading: isLoadingAllEmployments } =
    useGetAllEmployments();

  const getSelectedRowsToExport = ({ apiRef }) => {
    const selectedRowIds = selectedGridRowsSelector(apiRef);
    if (selectedRowIds.size > 0) {
      return Array.from(selectedRowIds.keys());
    }

    return gridFilteredSortedRowIdsSelector(apiRef);
  };

  const columnVisibilityModel = {
    id: false,
    user_id: false,
    username: true,
    job: true,
    company_name: true,
    date_hired: true,
    date_end: true,
    gross_monthly_income: false,
    employment_contract: false,
    job_position: false,
    employer_type: false,
    is_international: false,
    country: false,
    region: false,
    city: false,
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 200,
      editable: false,
    },
    {
      field: "user_id",
      headerName: "User ID",
      width: 150,
      editable: false,
    },
    {
      field: "username",
      headerName: "Username",
      width: 150,
      editable: false,
    },
    {
      field: "job",
      headerName: "Job Name",
      width: 200,
      editable: false,
    },
    {
      field: "company_name",
      headerName: "Company Name",
      width: 150,
      editable: false,
    },
    {
      field: "date_hired",
      headerName: "Date Hired",
      width: 150,
      editable: false,
    },
    {
      field: "date_end",
      headerName: "Date End",
      width: 200,
      editable: false,
    },
    {
      field: "gross_monthly_income",
      headerName: "Monthly Income",
      width: 120,
      editable: false,
    },
    {
      field: "employment_contract",
      headerName: "Employment Contract",
      width: 120,
      editable: false,
    },
    {
      field: "job_position",
      headerName: "Job Position",
      width: 150,
      editable: false,
    },
    {
      field: "employer_type",
      headerName: "Employer Type",
      width: 200,
      editable: false,
    },
    {
      field: "is_international",
      headerName: "International Job",
      width: 200,
      editable: false,
    },
    {
      field: "country",
      headerName: "Country",
      width: 200,
      editable: false,
    },
    {
      field: "region",
      headerName: "Region",
      width: 200,
      editable: false,
    },
    {
      field: "city",
      headerName: "City",
      width: 200,
      editable: false,
    },
  ];

  if (isLoadingAllEmployments) {
    return <div>loading...</div>;
  }

  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={allEmployments?.data?.employments}
        columns={columns}
        loading={isLoadingAllEmployments}
        checkboxSelection
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 25,
            },
          },
          columns: {
            columnVisibilityModel,
          },
        }}
        pageSizeOptions={[25]}
        disableRowSelectionOnClick
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            printOptions: { getRowsToExport: getSelectedRowsToExport },
          },
        }}
      />
    </Box>
  );
};

export default EmploymentDataGrid;
