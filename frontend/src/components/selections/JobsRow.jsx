import { styled, alpha } from "@mui/material/styles";
import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { TableVirtuoso } from "react-virtuoso";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useMutation, useQueryClient, useQuery } from "react-query";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";

import {
  Box,
  Button,
  Card,
  CardActionArea,
  Skeleton,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import EditJobModal from "./EditJobModal";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

export default function JobsRow() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [jobsID, setJobsID] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const handleModalOpen = (id) => {
    setModalOpen(true);
    setJobsID(id || "");
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setJobsID("");
  };

  const axiosPrivate = useAxiosPrivate();

  const columns = [
    {
      label: "job name",
      dataKey: "name",
    },
  ];

  const VirtuosoTableComponents = {
    Scroller: React.forwardRef((props, ref) => (
      <TableContainer component={Paper} {...props} ref={ref} />
    )),
    Table: (props) => (
      <Table
        {...props}
        sx={{ borderCollapse: "separate", tableLayout: "fixed" }}
      />
    ),
    TableHead,
    TableRow: ({ item: _item, ...props }) => (
      <Tooltip title={"click to delete or modify the job"}>
        <TableRow {...props} onClick={() => handleModalOpen(_item.id)} />
      </Tooltip>
    ),
    TableBody: React.forwardRef((props, ref) => (
      <TableBody {...props} ref={ref} />
    )),
  };

  function fixedHeaderContent() {
    return (
      <TableRow>
        {columns.map((column) => (
          <TableCell
            key={column.dataKey}
            variant="head"
            align={column.numeric || false ? "right" : "left"}
            sx={{
              width: column.width,
              backgroundColor: "background.paper",
            }}
          >
            <Typography variant={"subtitle1"} fontWeight={"bold"}>
              {column.label}
            </Typography>
          </TableCell>
        ))}
      </TableRow>
    );
  }

  function rowContent(index, item) {
    return (
      <React.Fragment>
        {columns.map((column) => (
          <TableCell
            key={column.dataKey}
            align={column.numeric || false ? "right" : "left"}
          >
            {item[column.dataKey]}
          </TableCell>
        ))}
      </React.Fragment>
    );
  }

  const getJobs = async () => {
    return await axiosPrivate.get("/selections/jobs/");
  };

  const { data: job, isLoading: isLoading } = useQuery(
    "jobs-all",
    getJobs
  );

  useEffect(() => {
    if (Array.isArray(job?.data)) {
      const newFilteredData = job.data.filter((item) => {
        return item.name.toLowerCase().includes(searchInput.toLowerCase());
      });

      newFilteredData.sort((a, b) => a.name.localeCompare(b.name));

      setFilteredData(newFilteredData);
    }
  }, [searchInput, job?.data]);

  if (isLoading) {
    return (
      <Card style={{ height: 400, width: "100%" }}>
        <Skeleton style={{ height: "100%", width: "100%", marginX: "auto" }} />
      </Card>
    );
  }

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  return (
    <>
      <Card style={{ height: 400, width: "100%" }}>
        <Search style={{ margin: "1rem" }}>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ "aria-label": "search" }}
            onChange={handleSearchInputChange}
          />
        </Search>
        <TableVirtuoso
          data={filteredData}
          components={VirtuosoTableComponents}
          fixedHeaderContent={fixedHeaderContent}
          itemContent={rowContent}
        />
      </Card>
      {
        <>
          {jobsID && (
            <EditJobModal
              open={isModalOpen}
              onClose={() => handleCloseModal()}
              jobsID={jobsID}
            />
          )}
        </>
      }
    </>
  );
}
