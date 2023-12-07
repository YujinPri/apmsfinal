import React from "react";
import Box from "@mui/material/Box";
import {
  DataGrid,
  GridToolbar,
  gridFilteredSortedRowIdsSelector,
  selectedGridRowsSelector,
} from "@mui/x-data-grid";
import useGetAll from "../../hooks/all_profiles/useGetAll";

const AllProfileDataGrid = () => {
  const { data: all, isLoading: isLoadingAll } = useGetAll();

  if (isLoadingAll) {
    return <div>loading...</div>;
  }

  const getSelectedRowsToExport = ({ apiRef }) => {
    const selectedRowIds = selectedGridRowsSelector(apiRef);
    if (selectedRowIds.size > 0) {
      return Array.from(selectedRowIds.keys());
    }

    return gridFilteredSortedRowIdsSelector(apiRef);
  };

  const columnVisibilityModel = Object.keys(all?.data[0]).reduce((acc, key) => {
    if (
      key == "first_name" ||
      key == "last_name" ||
      key == "student_number" ||
      key == "job_name"
    ) {
      acc[key] = true;
    } else {
      acc[key] = false;
    }
    return acc;
  }, {});

  const columns = Object.keys(columnVisibilityModel).map((key) => ({
    field: key,
    headerName: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " "), // Converts 'field_name' to 'Field name'
    width: 150,
    editable: false,
  }));

  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={all?.data}
        columns={columns}
        loading={isLoadingAll}
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

export default AllProfileDataGrid;
