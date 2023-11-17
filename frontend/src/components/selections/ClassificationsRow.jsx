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
import {
  Box,
  Button,
  Card,
  CardActionArea,
  Skeleton,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import EditClassificationModal from "./EditClassificationModal";

export default function ClassficationsRow() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [classificationID, setClassificationID] = useState(null);

  const handleModalOpen = (id) => {
    setModalOpen(true);
    setClassificationID(id || "");
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setClassificationID("");
  };

  const axiosPrivate = useAxiosPrivate();

  const columns = [
    {
      label: "classification name",
      dataKey: "name",
    },
    {
      label: "classification code",
      dataKey: "code",
      numeric: true,
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
      <Tooltip title={"click to delete or modify the classification"}>
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
    return await axiosPrivate.get("/selections/classifications/");
  };

  const { data: classification, isLoading: isLoading } = useQuery(
    "classifications-all",
    getJobs
  );

  if (isLoading) {
    return (
      <Card style={{ height: 400, width: "100%" }}>
        <Skeleton style={{ height: "100%", width: "100%", marginX: "auto" }} />
      </Card>
    );
  }

  return (
    <>
      <Card style={{ height: 400, width: "100%" }}>
        <TableVirtuoso
          data={classification.data}
          components={VirtuosoTableComponents}
          fixedHeaderContent={fixedHeaderContent}
          itemContent={rowContent}
        />
      </Card>
      {
        <>
          {classificationID && (
            <EditClassificationModal
              open={isModalOpen}
              onClose={() => handleCloseModal()}
              classificationID={classificationID}
            />
          )}
        </>
      }
    </>
  );
}
