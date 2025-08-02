import * as React from "react";
import { useContext, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button
} from "@mui/material";
import { AdminContext } from "../../context/AdminContext";

const AllIssues = () => {
  const { issues, aToken, getAllIssues, updateIssueStatus, updateIssuePriority } = useContext(AdminContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(8);
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [editRows, setEditRows] = useState({});

  useEffect(() => {
    if (aToken) {
      getAllIssues();
    }
  }, [aToken]);

  useEffect(() => {
    // Reset editRows when issues change
    const initial = {};
    (issues || []).forEach(issue => {
      initial[issue.issueId] = {
        status: issue.status || "",
        priority: issue.priority || ""
      };
    });
    setEditRows(initial);
  }, [issues]);

  const filteredIssues = (issues || []).filter((issue) => {
    const lowerSearch = searchTerm.toLowerCase();
    const issueId = (issue.issueId || "").toLowerCase();
    const sensorId = (issue.sensorId || "").toLowerCase();
    const empId = (issue.empId || "").toLowerCase();
    const empName = (issue.empName || "").toLowerCase();
    const empEmail = (issue.empEmail || "").toLowerCase();
    const matchesSearch =
      sensorId.includes(lowerSearch) ||
      issueId.includes(lowerSearch) ||
      empId.includes(lowerSearch) ||
      empName.includes(lowerSearch) ||
      empEmail.includes(lowerSearch);

    const matchesStatus =
      statusFilter === "" || (issue.status || "") === statusFilter;
    const matchesPriority =
      priorityFilter === "" || (issue.priority || "") === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const visibleIssues = filteredIssues.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  // Handler for status change
  const handleEditRowChange = (issueId, field, value) => {
    setEditRows(prev => ({
      ...prev,
      [issueId]: {
        ...prev[issueId],
        [field]: value
      }
    }));
  };

  const handleUpdate = (issueId) => {
    const { status, priority } = editRows[issueId];
    updateIssueStatus(issueId, status);
    updateIssuePriority(issueId, priority);
  };

  return (
    <div className="w-full overflow-scroll">
      {/* Filters */}
      <div className="flex gap-4 mb-4 items-center">
        <input
          type="text"
          placeholder="Search by sensor or employee"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-primary rounded-full w-full px-5 py-1.5"
        />

        <FormControl className="w-full">
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="in-progress">In Progress</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>

        <FormControl className="w-full">
          <InputLabel>Priority</InputLabel>
          <Select
            value={priorityFilter}
            label="Priority"
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="high">High</MenuItem>
          </Select>
        </FormControl>
      </div>

      {/* Table Display */}
      <TableContainer component={Paper} className="mb-5">
        <Table sx={{ minWidth: 900 }} aria-label="issues table">
          <TableHead className="bg-third">
            <TableRow>
              <TableCell>Issue Id</TableCell>
              <TableCell>Sensor Id</TableCell>
              <TableCell>Employee Id</TableCell>
              <TableCell>Employee Name</TableCell>
              <TableCell>Employee Email</TableCell>
              <TableCell>Issue Description</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="bg-third/20">
            {visibleIssues.map((issue, index) => (
              <TableRow key={index}>
                <TableCell>{issue.issueId}</TableCell>
                <TableCell>{issue.sensorId}</TableCell>
                <TableCell>{issue.empId}</TableCell>
                <TableCell>{issue.empName}</TableCell>
                <TableCell>{issue.empEmail}</TableCell>
                <TableCell>{issue.issueDescription}</TableCell>
                <TableCell>
                  <Select
                    value={editRows[issue.issueId]?.status || ""}
                    onChange={(e) => handleEditRowChange(issue.issueId, "status", e.target.value)}
                    size="small"
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="in-progress">In Progress</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  <Select
                    value={editRows[issue.issueId]?.priority || ""}
                    onChange={(e) => handleEditRowChange(issue.issueId, "priority", e.target.value)}
                    size="small"
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => handleUpdate(issue.issueId)}
                  >
                    Update
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Load More Button */}
      {visibleCount < filteredIssues.length && (
        <div className="mb-5 flex justify-center">
          <button
            className="bg-primary text-white px-5 py-2 rounded-full"
            onClick={handleLoadMore}
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default AllIssues;
