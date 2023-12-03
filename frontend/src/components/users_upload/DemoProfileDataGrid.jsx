import React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import useGetAllProfiles from "../../hooks/useGetAllProfiles";

const DemoProfileDataGrid = () => {
  const { data: allProfiles, isLoading: isLoadingAllProfiles } =
    useGetAllProfiles();

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 200,
      editable: false,
    },
    {
      field: "student_number",
      headerName: "Student Number",
      width: 150,
      editable: true,
    },
    {
      field: "username",
      headerName: "Username",
      width: 150,
      editable: true,
    },
    {
      field: "first_name",
      headerName: "First Name",
      width: 150,
      editable: true,
    },
    {
      field: "last_name",
      headerName: "Last Name",
      width: 150,
      editable: true,
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
      editable: true,
    },
    {
      field: "gender",
      headerName: "Gender",
      width: 120,
      editable: true,
    },
    {
      field: "role",
      headerName: "Role",
      width: 120,
      editable: true,
    },
    {
      field: "birthdate",
      headerName: "Birthdate",
      width: 150,
      editable: true,
    },
    {
      field: "mobile_number",
      headerName: "Mobile Number",
      width: 200,
      editable: true,
    },
    {
      field: "telephone_number",
      headerName: "Telephone Number",
      width: 200,
      editable: true,
    },
    {
      field: "headline",
      headerName: "Headline",
      width: 200,
      editable: true,
    },
    {
      field: "civil_status",
      headerName: "Civil Status",
      width: 150,
      editable: true,
    },
    {
      field: "date_graduated",
      headerName: "Date Graduated",
      width: 200,
      editable: true,
    },
    {
      field: "course",
      headerName: "Course",
      width: 200,
      editable: true,
    },
    {
      field: "is_international",
      headerName: "Is International",
      width: 150,
      editable: true,
    },
    {
      field: "country",
      headerName: "Country",
      width: 150,
      editable: true,
    },
    {
      field: "region",
      headerName: "Region",
      width: 150,
      editable: true,
    },
    {
      field: "city",
      headerName: "City",
      width: 150,
      editable: true,
    },
    {
      field: "barangay",
      headerName: "Barangay",
      width: 150,
      editable: true,
    },
    {
      field: "address",
      headerName: "Address",
      width: 200,
      editable: true,
    },
    {
      field: "origin_is_international",
      headerName: "Origin Is International",
      width: 200,
      editable: true,
    },
    {
      field: "origin_country",
      headerName: "Origin Country",
      width: 200,
      editable: true,
    },
    {
      field: "origin_region",
      headerName: "Origin Region",
      width: 200,
      editable: true,
    },
    {
      field: "origin_city",
      headerName: "Origin City",
      width: 200,
      editable: true,
    },
    {
      field: "origin_barangay",
      headerName: "Origin Barangay",
      width: 200,
      editable: true,
    },
    {
      field: "origin_address",
      headerName: "Origin Address",
      width: 200,
      editable: true,
    },
  ];

  if (isLoadingAllProfiles) {
    return <div>loading...</div>;
  }

  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={allProfiles?.data?.profiles}
        columns={columns}
        loading={isLoadingAllProfiles}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
          columns: {
            columnVisibilityModel: {
              id: false,
              student_number: false,
              username: true,
              first_name: false,
              last_name: false,
              email: true,
              gender: false,
              role: true,
              birthdate: false,
              mobile_number: false,
              telephone_number: false,
              headline: false,
              civil_status: false,
              date_graduated: false,
              course: false,
              is_international: false,
              country: false,
              region: false,
              city: false,
              barangay: false,
              address: false,
              origin_is_international: false,
              origin_country: false,
              origin_region: false,
              origin_city: false,
              origin_barangay: false,
              origin_address: false,
            },
          },
        }}
        pageSizeOptions={[5]}
        disableRowSelectionOnClick
      />
    </Box>
  );
};

export default DemoProfileDataGrid;
