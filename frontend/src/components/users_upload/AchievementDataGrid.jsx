import React from "react";
import Box from "@mui/material/Box";
import {
  DataGrid,
  GridToolbar,
  gridFilteredSortedRowIdsSelector,
  selectedGridRowsSelector,
} from "@mui/x-data-grid";
import useGetAllAchievements from "../../hooks/all_profiles/useGetAllAchievements";

const AchievementDataGrid = () => {
  const { data: allAchievements, isLoading: isLoadingAllAchievements } =
    useGetAllAchievements();

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
    type_of_achievement: true,
    date_of_attainment: true,
    description: true,
    story: false,
    link_reference: false,
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
      field: "type_of_achievement",
      headerName: "Achievement Type",
      width: 200,
      editable: false,
    },
    {
      field: "date_of_attainment",
      headerName: "Attainment Date",
      width: 150,
      editable: false,
    },
    {
      field: "description",
      headerName: "Short Description",
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
      field: "link_reference",
      headerName: "Reference",
      width: 120,
      editable: false,
    },
  ];

  if (isLoadingAllAchievements) {
    return <div>loading...</div>;
  }

  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={allAchievements?.data?.achievements}
        columns={columns}
        loading={isLoadingAllAchievements}
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

export default AchievementDataGrid;
