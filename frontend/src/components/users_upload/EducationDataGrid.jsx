import React from "react";
import Box from "@mui/material/Box";
import {
  DataGrid,
  GridToolbar,
  gridFilteredSortedRowIdsSelector,
  selectedGridRowsSelector,
} from "@mui/x-data-grid";
import useGetAllEducations from "../../hooks/all_profiles/useGetAllEducations";

const EducationDataGrid = () => {
  const { data: allEducations, isLoading: isLoadingAllEducations } =
    useGetAllEducations();

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
    course: false,
    level: true,
    school_name: true,
    story: false,
    is_international: false,
    country: false,
    region: false,
    city: false,
    date_start: true,
    date_graduated: true,
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
      field: "course",
      headerName: "Course",
      width: 200,
      editable: false,
    },
    {
      field: "level",
      headerName: "Level",
      width: 150,
      editable: false,
    },
    {
      field: "school_name",
      headerName: "School Name",
      width: 150,
      editable: false,
    },
    {
      field: "story",
      headerName: "Story",
      width: 200,
      editable: false,
    },
    {
      field: "is_international",
      headerName: "International School",
      width: 120,
      editable: false,
    },
    {
      field: "country",
      headerName: "Country",
      width: 120,
      editable: false,
    },
    {
      field: "region",
      headerName: "Region",
      width: 150,
      editable: false,
    },
    {
      field: "city",
      headerName: "City",
      width: 200,
      editable: false,
    },
    {
      field: "date_start",
      headerName: "Date Start",
      width: 200,
      editable: false,
    },
    {
      field: "date_graduated",
      headerName: "Date Graduated",
      width: 200,
      editable: false,
    },
  ];

  if (isLoadingAllEducations) {
    return <div>loading...</div>;
  }

  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={allEducations?.data?.educations}
        columns={columns}
        loading={isLoadingAllEducations}
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

export default EducationDataGrid;
