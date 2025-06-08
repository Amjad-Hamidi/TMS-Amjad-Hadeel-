import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Pagination,
  Stack,
  Tabs,
  Tab,
  Dialog,
  DialogContent,
  IconButton,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CancelIcon from "@mui/icons-material/Cancel";
import CloseIcon from "@mui/icons-material/Close";
import GroupIcon from "@mui/icons-material/Group";
import ArticleIcon from "@mui/icons-material/Article";
import ListAltIcon from "@mui/icons-material/ListAlt";

// Import new icons for properties
import ApartmentIcon from "@mui/icons-material/Apartment"; // For Company Name
import NumbersIcon from "@mui/icons-material/Numbers"; // For ID
import CategoryIcon from "@mui/icons-material/Category"; // For Category
import PersonIcon from "@mui/icons-material/Person"; // For Supervisor
import AccessTimeIcon from "@mui/icons-material/AccessTime"; // For Duration
import EventIcon from "@mui/icons-material/Event"; // For Start/End Date, Rejection Date
import LocationOnIcon from "@mui/icons-material/LocationOn"; // For Location
import EventSeatIcon from "@mui/icons-material/EventSeat"; // For Seats Available
import StarIcon from "@mui/icons-material/Star"; // For Rating
import DescriptionIcon from "@mui/icons-material/Description"; // For Description
import LinkIcon from "@mui/icons-material/Link"; // For Content/Classroom URL
import WebIcon from "@mui/icons-material/Web"; // For Content URL
import SchoolIcon from "@mui/icons-material/School"; // For Classroom URL
import ReportProblemIcon from "@mui/icons-material/ReportProblem"; // For Rejection Reason


import { fetchWithAuth } from "../utils/fetchWithAuth";

const API_BASE = "https://amjad-hamidi-tms.runasp.net/api/TrainingPrograms";
const LIMIT = 6;

const tabList = [
  { label: "All", value: "all", color: "primary" },
  { label: "Pending", value: "pending", color: "warning" },
  { label: "Approved", value: "approved", color: "success" },
  { label: "Rejected", value: "rejected", color: "error" },
];

// Component for a custom tooltip
const CustomTooltip = ({ children, title, placement = 'right' }) => {
  const [show, setShow] = useState(false);

  const getTooltipStyle = () => {
    switch (placement) {
      case 'right':
        return {
          left: 'calc(100% + 8px)',
          top: '50%',
          transform: 'translateY(-50%)',
        };
      case 'bottom':
        return {
          top: 'calc(100% + 8px)',
          left: '50%',
          transform: 'translateX(-50%)',
        };
      default:
        return {};
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
      }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && title && (
        <Typography
          variant="caption"
          sx={{
            position: 'absolute',
            zIndex: 1000,
            background: 'rgba(0, 0, 0, 0.75)',
            color: '#fff',
            borderRadius: '4px',
            px: 1,
            py: 0.5,
            whiteSpace: 'nowrap',
            ...getTooltipStyle(),
          }}
        >
          {title}
        </Typography>
      )}
    </Box>
  );
};

export default function AdminProgramsOverview() {
  const [tab, setTab] = useState("all");
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Change expanded to an object to store expansion state per program ID
  const [expanded, setExpanded] = useState({}); // This will be initialized in useEffect
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);
  const [page, setPage] = useState({
    all: 1,
    pending: 1,
    approved: 1,
    rejected: 1,
  });
  const [totalPages, setTotalPages] = useState({
    all: 1,
    pending: 1,
    approved: 1,
    rejected: 1,
  });
  const [totalCounts, setTotalCounts] = useState({
    all: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setActionError(null);
    setActionSuccess(null);

    const fetchTab = async (type, pageNum) => {
      let url = "";
      if (type === "pending")
        url = `${API_BASE}/all-pending?page=${pageNum}&limit=${LIMIT}`;
      else if (type === "approved")
        url = `${API_BASE}/all-approved?page=${pageNum}&limit=${LIMIT}`;
      else if (type === "rejected")
        url = `${API_BASE}/all-rejected?page=${pageNum}&limit=${LIMIT}`;
      else {
        return Promise.resolve({
          items: [],
          totalCount: 0,
          page: pageNum,
          limit: LIMIT,
          totalPages: 1,
        });
      }

      try {
        const res = await fetchWithAuth(url);
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
        return res.json();
      } catch (err) {
        console.error(`Error fetching ${type} programs:`, err);
        throw err;
      }
    };

    if (tab === "all") {
      Promise.allSettled([
        fetchTab("pending", page.pending),
        fetchTab("approved", page.approved),
        fetchTab("rejected", page.rejected),
      ])
        .then(([pendingRes, approvedRes, rejectedRes]) => {
          const pending =
            pendingRes.status === "fulfilled"
              ? pendingRes.value
              : { items: [], totalCount: 0 };
          const approved =
            approvedRes.status === "fulfilled"
              ? approvedRes.value
              : { items: [], totalCount: 0 };
          const rejected =
            rejectedRes.status === "fulfilled"
              ? rejectedRes.value
              : { items: [], totalCount: 0 };

          const pendingList = (pending.items || []).map((p) => ({
            ...p,
            status: "Pending",
          }));
          const approvedList = (approved.items || []).map((p) => ({
            ...p,
            status: "Approved",
          }));
          const rejectedList = (rejected.items || []).map((p) => ({
            ...p,
            status: "Rejected",
          }));

          const combinedPrograms = [
            ...pendingList,
            ...approvedList,
            ...rejectedList,
          ].sort((a, b) => {
            const dateA = new Date(a.creationDate || a.startDate);
            const dateB = new Date(b.creationDate || b.startDate);
            return dateB - dateA;
          });
          setPrograms(combinedPrograms);

          // Initialize all programs to be expanded by default
          const initialExpandedState = {};
          combinedPrograms.forEach(p => {
            initialExpandedState[p.trainingProgramId] = true;
          });
          setExpanded(initialExpandedState); // Set initial state here

          setTotalPages({
            all:
              Math.ceil(
                (pending.totalCount + approved.totalCount + rejected.totalCount) /
                  LIMIT
              ) || 1,
            pending: Math.ceil(pending.totalCount / LIMIT) || 1,
            approved: Math.ceil(approved.totalCount / LIMIT) || 1,
            rejected: Math.ceil(rejected.totalCount / LIMIT) || 1,
          });

          setTotalCounts({
            all:
              pending.totalCount + approved.totalCount + rejected.totalCount,
            pending: pending.totalCount,
            approved: approved.totalCount,
            rejected: rejected.totalCount,
          });

          setLoading(false);
        })
        .catch((err) => {
          setError("Failed to load programs for all tabs.");
          setLoading(false);
        });
    } else {
      fetchTab(tab, page[tab])
        .then((data) => {
          const list = (data.items || []).map((p) => ({
            ...p,
            status: tab.charAt(0).toUpperCase() + tab.slice(1),
          }));
          setPrograms(list);
          
          // Initialize all programs in the current tab to be expanded by default
          const initialExpandedState = {};
          list.forEach(p => {
            initialExpandedState[p.trainingProgramId] = true;
          });
          setExpanded(initialExpandedState); // Set initial state here

          setTotalPages((prev) => ({
            ...prev,
            [tab]: Math.ceil((data.totalCount || 1) / LIMIT),
          }));
          setTotalCounts((prev) => ({ ...prev, [tab]: data.totalCount || 0 }));
          setLoading(false);
        })
        .catch((err) => {
          setError("Failed to load programs for current tab.");
          setLoading(false);
        });
    }
  }, [tab, page.all, page.pending, page.approved, page.rejected]);

  const handleApprove = async (id) => {
    setActionLoading(true);
    setActionError(null);
    setActionSuccess(null);
    try {
      const res = await fetchWithAuth(`${API_BASE}/approve/${id}`, {
        method: "PATCH",
      });
      const text = await res.text();
      if (!res.ok) throw new Error(text);
      setActionSuccess(text);
      // Remove approved program from the list
      setPrograms((prev) => prev.filter((p) => p.trainingProgramId !== id));
      // Remove its expanded state
      setExpanded(prev => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
      // Logic to re-fetch or adjust page based on tab
      if (tab === "all" || tab === "pending") {
        setPage((prev) => ({ ...prev, [tab]: 1 })); // Go to first page to re-fetch
      } else {
        setPage((prev) => ({ ...prev, [tab]: page[tab] })); // Stay on current page, component will re-render
      }
    } catch (err) {
      setActionError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt("Enter rejection reason:");
    if (!reason) return;
    setActionLoading(true);
    setActionError(null);
    setActionSuccess(null);
    try {
      const res = await fetchWithAuth(
        `${API_BASE}/reject/${id}?reason=${encodeURIComponent(reason)}`,
        {
          method: "PATCH",
        }
      );
      const text = await res.text();
      if (!res.ok) throw new Error(text);
      setActionSuccess(text);
      // Remove rejected program from the list
      setPrograms((prev) => prev.filter((p) => p.trainingProgramId !== id));
      // Remove its expanded state
      setExpanded(prev => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
      // Logic to re-fetch or adjust page based on tab
      if (tab === "all" || tab === "pending") {
        setPage((prev) => ({ ...prev, [tab]: 1 })); // Go to first page to re-fetch
      } else {
        setPage((prev) => ({ ...prev, [tab]: page[tab] })); // Stay on current page, component will re-render
      }
    } catch (err) {
      setActionError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    // Reset expanded state when tab changes, but useEffect will re-initialize it to all true
  };

  const handlePageChange = (event, value) => {
    setPage((prev) => ({ ...prev, [tab]: value }));
  };

  const handleImageClick = (imageUrl) => {
    const fullImageUrl = imageUrl.startsWith("http")
      ? imageUrl
      : `https://amjad-hamidi-tms.runasp.net${imageUrl}`;
    setSelectedImage(fullImageUrl);
  };

  const handleCloseImageDialog = () => {
    setSelectedImage(null);
  };

  // Modified handleToggleDetails to manage per-card expansion
  const handleToggleDetails = (id) => {
    setExpanded(prev => ({
      ...prev,
      [id]: !prev[id] // Toggle the state for this specific card ID
    }));
  };

  // Helper function to render a property with its icon and custom tooltip
  const renderProperty = (IconComponent, label, value) => {
    if (value === undefined || value === null || (typeof value === 'string' && value.trim() === "")) return null;

    let displayValue = value;
    if (value instanceof Date) {
      displayValue = value.toLocaleDateString();
    } else if (typeof value === 'boolean') {
      displayValue = value ? 'Yes' : 'No';
    }

    return (
      <CustomTooltip title={label}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            py: 0.2,
            px: 0.5,
            borderRadius: 1,
            transition: 'background-color 0.2s',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.05)',
            },
          }}
        >
          {IconComponent && <IconComponent fontSize="small" sx={{ color: 'text.secondary' }} />}
          <Typography variant="body2">
            <b>{label}:</b> {displayValue}
          </Typography>
        </Box>
      </CustomTooltip>
    );
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 2, background: "#f5f7fa", minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold", color: "#1e3c72" }}>
        Training Programs Overview
      </Typography>

      <Tabs
        value={tab}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{
          mb: 4,
          borderRadius: 3,
          background: "#fff",
          boxShadow: "0 2px 12px 0 #00000011",
          minHeight: 56,
          "& .MuiTab-root": {
            fontWeight: 700,
            fontSize: 18,
            borderRadius: 3,
            mx: 1,
            minHeight: 56,
            transition: "all 0.2s",
          },
          "& .Mui-selected": {
            color: "#fff !important",
          },
        }}
        TabIndicatorProps={{
          style: {
            height: 0,
          },
        }}
      >
        {tabList.map((t) => (
          <Tab
            key={t.value}
            value={t.value}
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {t.value === "pending" && <HourglassEmptyIcon fontSize="small" />}
                {t.value === "approved" && <CheckCircleIcon fontSize="small" />}
                {t.value === "rejected" && <CancelIcon fontSize="small" />}
                {t.label}
              </Box>
            }
            sx={{
              background:
                tab === t.value
                  ? t.color === "primary"
                    ? "#1976d2"
                    : t.color === "warning"
                    ? "#ff9800"
                    : t.color === "success"
                    ? "#43a047"
                    : "#e53935"
                  : "#fff",
              color:
                tab === t.value
                  ? "#fff"
                  : t.color === "primary"
                  ? "#1976d2"
                  : t.color === "warning"
                  ? "#ff9800"
                  : t.color === "success"
                  ? "#43a047"
                  : "#e53935",
              boxShadow:
                tab === t.value
                  ? `0 4px 16px 0 ${
                        (t.color === "primary"
                          ? "#1976d2"
                          : t.color === "warning"
                          ? "#ff9800"
                          : t.color === "success"
                          ? "#43a047"
                          : "#e53935") 
                      }99`
                    : "none",
              border: `2px solid ${
                t.color === "primary"
                  ? "#1976d2"
                  : t.color === "warning"
                  ? "#ff9800"
                  : t.color === "success"
                  ? "#43a047"
                  : "#e53935"
              }`,
              borderRadius: 3,
              mx: 1,
              minHeight: 56,
              fontWeight: 700,
              fontSize: 18,
              transition: "all 0.2s",
              "&:hover": {
                background:
                  t.color === "primary"
                    ? "#1976d2"
                    : t.color === "warning"
                    ? "#ff9800"
                    : t.color === "success"
                    ? "#43a047"
                    : "#e53935",
                color: "#fff",
                boxShadow: `0 4px 16px 0 ${
                  t.color === "primary"
                    ? "#1976d2"
                    : t.color === "warning"
                    ? "#ff9800"
                    : t.color === "success"
                    ? "#43a047"
                    : "#e53935"
                }99`,
              },
            }}
          />
        ))}
      </Tabs>

      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Chip
          icon={<GroupIcon />}
          label={`Total Programs: ${totalCounts[tab]}`}
          color="primary"
          sx={{ pl: 1, fontWeight: "bold" }}
        />
        <Chip
          icon={<ArticleIcon />}
          label={`Page: ${page[tab]} / ${totalPages[tab]}`}
          color="secondary"
          sx={{ pl: 1, fontWeight: "bold" }}
        />
        <Chip
          icon={<ListAltIcon />}
          label={`Programs per page: ${LIMIT}`}
          color="info"
          sx={{ pl: 1, fontWeight: "bold" }}
        />
      </Stack>

      {loading && (
        <Stack alignItems="center" sx={{ my: 4 }}>
          <CircularProgress />
        </Stack>
      )}
      {error && <Alert severity="error">{error}</Alert>}
      {actionError && <Alert severity="error">{actionError}</Alert>}
      {actionSuccess && <Alert severity="success">{actionSuccess}</Alert>}

      <Stack direction="row" flexWrap="wrap" gap={4} justifyContent="left">
        {!loading && programs.length === 0 && (
          <Typography variant="h6" color="text.secondary" sx={{ mt: 4 }}>
            No programs found for this category.
          </Typography>
        )}
        {!loading &&
          programs.map((p) => (
            <Card
              key={p.trainingProgramId}
              sx={{
                width: 340,
                borderRadius: 4,
                boxShadow: "0 4px 24px 0 #00000014",
                position: "relative",
                transition: "transform 0.2s, box-shadow 0.2s, height 0.3s ease-out", // Add height transition
                "&:hover": {
                  transform: "translateY(-6px) scale(1.03)",
                  boxShadow: "0 8px 32px 0 #00000022",
                },
                background: "#fff",
                // Conditional height based on expanded state
                height: expanded[p.trainingProgramId] ? 'auto' : '230px', // Set a fixed small height when collapsed
                overflow: 'hidden', // Hide overflow content when collapsed
              }}
            >
              {p.imagePath && (
                <CustomTooltip title="Program Image" placement="bottom">
                  <CardMedia
                    component="img"
                    height="170"
                    image={
                      p.imagePath.startsWith("http")
                        ? p.imagePath
                        : `https://amjad-hamidi-tms.runasp.net${p.imagePath}`
                    }
                    alt={p.title}
                    sx={{
                      objectFit: "cover",
                      borderTopLeftRadius: 16,
                      borderTopRightRadius: 16,
                      borderBottom: "2px solid #f0f0f0",
                      cursor: "pointer",
                    }}
                    onClick={() => handleImageClick(p.imagePath)}
                  />
                </CustomTooltip>
              )}

              {/* CardContent is now always rendered, but its visibility is controlled by state */}
              {/* To remove all white space, we apply conditional padding and margins directly inside CardContent */}
              <CardContent sx={{ p: expanded[p.trainingProgramId] ? 2 : 0, transition: 'padding 0.3s ease-out', }}>
                {expanded[p.trainingProgramId] && ( // Only render content if expanded
                  <>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={1}
                    >
                      <CustomTooltip title="Program Title">
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          {p.title}
                        </Typography>
                      </CustomTooltip>
                      <CustomTooltip title="Program Status" placement="bottom">
                        <Chip
                          label={p.status?.toUpperCase()}
                          icon={
                            p.status === "Pending" ? (
                              <HourglassEmptyIcon fontSize="small" />
                            ) : p.status === "Approved" ? (
                              <CheckCircleIcon fontSize="small" />
                            ) : p.status === "Rejected" ? (
                              <CancelIcon fontSize="small" />
                            ) : null
                          }
                          color={
                            p.status === "Pending"
                              ? "warning"
                              : p.status === "Approved"
                              ? "success"
                              : p.status === "Rejected"
                              ? "error"
                              : "default"
                          }
                          size="medium"
                          sx={{
                            fontWeight: "bold",
                            fontSize: 15,
                            px: 2,
                            py: 1,
                            borderRadius: 2,
                            letterSpacing: 1,
                            boxShadow: `0 2px 8px 0 #00000011`,
                          }}
                        />
                      </CustomTooltip>
                    </Stack>
                    
                    {renderProperty(ApartmentIcon, "Company Name", p.companyName || "")}
                    <Stack spacing={0.5} sx={{ mt: 1 }}>
                      {renderProperty(NumbersIcon, "ID", p.trainingProgramId)}
                      {renderProperty(CategoryIcon, "Category", p.categoryName)}
                      {renderProperty(PersonIcon, "Supervisor", p.supervisorName)}
                      {p.durationInDays ? renderProperty(AccessTimeIcon, "Duration (days)", p.durationInDays) : renderProperty(AccessTimeIcon, "Duration", p.duration)}
                      
                      {p.startDate && renderProperty(EventIcon, "Start Date", new Date(p.startDate))}
                      {p.endDate && renderProperty(EventIcon, "End Date", new Date(p.endDate))}
                      
                      {renderProperty(LocationOnIcon, "Location", p.location)}
                      {p.seatsAvailable !== undefined && renderProperty(EventSeatIcon, "Seats Available", p.seatsAvailable)}
                      {p.rating !== undefined && renderProperty(StarIcon, "Rating", p.rating)}
                      {p.rejectionReason && renderProperty(ReportProblemIcon, "Rejection Reason", p.rejectionReason)}
                      
                      {p.rejectionDate && renderProperty(EventIcon, "Rejection Date", new Date(p.rejectionDate))}
                    </Stack>
                    {p.status === "Pending" && (
                      <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          disabled={actionLoading}
                          onClick={() => handleApprove(p.trainingProgramId)}
                          sx={{
                            transition: "transform 0.2s ease-in-out",
                            "&:hover": {
                              transform: "scale(1.05)",
                              backgroundColor: "#28a745",
                            },
                          }}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          disabled={actionLoading}
                          onClick={() => handleReject(p.trainingProgramId)}
                          sx={{
                            transition: "transform 0.2s ease-in-out",
                            "&:hover": {
                              transform: "scale(1.05)",
                              backgroundColor: "#c82333",
                            },
                          }}
                        >
                          Reject
                        </Button>
                      </Stack>
                    )}
                    <Box sx={{ mt: 1 }}>
                      {renderProperty(DescriptionIcon, "Description", p.description)}
                      {p.contentUrl && (
                         <CustomTooltip title="Content URL">
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<WebIcon />}
                            href={p.contentUrl}
                            target="_blank"
                            rel="noreferrer"
                            sx={{
                              mt: 1,
                              color: '#1976d2',
                              borderColor: '#1976d2',
                              '&:hover': {
                                backgroundColor: '#e3f2fd',
                                borderColor: '#1976d2',
                                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                              },
                              textTransform: 'none',
                              fontWeight: 600,
                            }}
                          >
                            View Content
                          </Button>
                         </CustomTooltip>
                      )}
                      {p.classroomUrl && (
                        <CustomTooltip title="Classroom URL">
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<SchoolIcon />}
                            href={p.classroomUrl}
                            target="_blank"
                            rel="noreferrer"
                            sx={{
                              mt: 1,
                              ml: p.contentUrl ? 1 : 0,
                              color: '#43a047',
                              borderColor: '#43a047',
                              '&:hover': {
                                backgroundColor: '#e8f5e9',
                                borderColor: '#43a047',
                                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                              },
                              textTransform: 'none',
                              fontWeight: 600,
                            }}
                          >
                            View Classroom
                          </Button>
                        </CustomTooltip>
                      )}
                    </Box>
                  </>
                )}
              </CardContent>

              {/* The "Show Details" / "Hide Details" button is always present */}
              <Box sx={{ p: 2, pt: 0 }}> {/* Always 0 padding-top for the button's container */}
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    mt: expanded[p.trainingProgramId] ? 2 : 0, // Keep mt if expanded for spacing
                    borderRadius: 2,
                    fontWeight: 600,
                    color: "#1976d2",
                    borderColor: "#1976d2",
                    "&:hover": {
                      backgroundColor: "#e3f2fd",
                      borderColor: "#1976d2",
                    },
                    width: '100%' // Make button full width
                  }}
                  onClick={() => handleToggleDetails(p.trainingProgramId)}
                >
                  {expanded[p.trainingProgramId] ? "Hide Details" : "Show Details"}
                </Button>
              </Box>
            </Card>
          ))}
      </Stack>
      <Stack alignItems="center" sx={{ mt: 4 }}>
        <Pagination
          count={totalPages[tab] || 1}
          page={page[tab]}
          onChange={handlePageChange}
          color="primary"
          shape="rounded"
          size="large"
          showFirstButton
          showLastButton
          sx={{
            "& .MuiPaginationItem-root": {
              fontWeight: 700,
              fontSize: 18,
              borderRadius: 2,
              mx: 0.5,
              transition: "all 0.2s",
              "&:hover": {
                backgroundColor: "#1976d2",
                color: "#fff",
                transform: "scale(1.05)",
              },
              "&.Mui-selected": {
                color: "#fff !important",
                background: "#1976d2 !important",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                transform: "scale(1.05)",
              },
              "&.Mui-disabled": {
                opacity: 0.5,
                pointerEvents: "none",
              },
            },
            "& .MuiPaginationItem-firstLast": {
              "&:hover": {
                backgroundColor: "#1976d2",
                color: "#fff",
                transform: "scale(1.05)",
              },
              "&.Mui-disabled": {
                opacity: 0.5,
                pointerEvents: "none",
              },
            },
          }}
        />
      </Stack>

      <Dialog
        open={Boolean(selectedImage)}
        onClose={handleCloseImageDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogContent
          dividers
          sx={{ position: "relative", p: 0 }}
        >
          <IconButton
            aria-label="close"
            onClick={handleCloseImageDialog}
            sx={{
              width: "fit-content",
              position: "absolute",
              right: 8,
              top: 8,
              zIndex: 1,
              backgroundColor: "rgba(11, 56, 180, 0.7)",
              "&:hover": {
                backgroundColor: "rgba(228, 133, 231, 0.9)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>

          {selectedImage && (
            <Box
              component="img"
              src={selectedImage}
              alt="Program Image Preview"
              sx={{
                width: "50%",
                height: "auto",
                maxHeight: "80vh",
                display: "block",
                mx: "auto",
                objectFit: "contain",
                p: 2,
                margin: "auto",
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}