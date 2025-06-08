import React, { useEffect, useState, useCallback } from "react";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import debounce from "lodash/debounce";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Chip,
  Rating,
  Pagination,
  Paper,
  Tooltip,
  Stack,
  TextField,
  Fade,
  Dialog, // Import Dialog
  DialogContent, // Import DialogContent
  IconButton, // Import IconButton
} from "@mui/material";
import {
  Event as EventIcon,
  LocationOn as LocationOnIcon,
  AccessTime as AccessTimeIcon,
  PeopleOutline as PeopleOutlineIcon,
  Business as BusinessIcon,
  CalendarToday as CalendarTodayIcon,
  InfoOutlined as InfoOutlinedIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  HourglassEmpty as HourglassEmptyIcon,
  Cancel as CancelIcon,
  Category as CategoryIcon,
  Link as LinkIcon,
  School as SchoolIcon,
  StarBorder as StarBorderIcon,
  Update as UpdateIcon,
  ErrorOutline as ErrorOutlineIcon,
  Assessment as AssessmentIcon,
  FormatListNumbered as FormatListNumberedIcon, // replaced PageviewIcon
  List as ListIcon, // replaced GroupIcon
  Close as CloseIcon, // Import CloseIcon for the modal
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const ITEMS_PER_PAGE = 6;

const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  transition: theme.transitions.create(["transform", "box-shadow"], {
    duration: theme.transitions.duration.short,
  }),
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[8],
  },
}));

export default function SupervisorPrograms() {
  const [programs, setPrograms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // New state for image preview modal
  const [openImageModal, setOpenImageModal] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [selectedImageAlt, setSelectedImageAlt] = useState("");

  const fetchPrograms = useCallback(
    async (currentPage, search = "") => {
      setIsLoading(true);
      setErrorMessage("");
      try {
        const params = new URLSearchParams({
          page: currentPage,
          limit: ITEMS_PER_PAGE,
        });
        if (search) params.append("search", search);

        const response = await fetchWithAuth(
          `https://amjad-hamidi-tms.runasp.net/api/TrainingPrograms/my-supervised?${params.toString()}`
        );
        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(errorData || "Failed to fetch programs.");
        }
        const data = await response.json();
        setPrograms(data.items || []);
        const computedTotalPages = Math.ceil((data.totalCount || 0) / ITEMS_PER_PAGE);
        setTotalPages(computedTotalPages);
        setTotalCount(data.totalCount || 0);
        setPage(data.page || currentPage);
        if ((data.items || []).length === 0) {
          setErrorMessage("No programs found under your supervision.");
        }
      } catch (error) {
        setErrorMessage(error.message || "Failed to load programs.");
        setPrograms([]);
        setTotalPages(0);
        setTotalCount(0);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Debounce search input
  const debouncedSetSearchTerm = useCallback(
    debounce((newTerm) => {
      setDebouncedSearchTerm(newTerm);
      setPage(1);
    }, 500),
    []
  );

  useEffect(() => {
    debouncedSetSearchTerm(searchTerm);
    return () => {
      debouncedSetSearchTerm.cancel();
    };
  }, [searchTerm, debouncedSetSearchTerm]);

  useEffect(() => {
    fetchPrograms(page, debouncedSearchTerm);
  }, [page, debouncedSearchTerm, fetchPrograms]);

  const handlePageChange = (_, value) => {
    setPage(value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  // Handler for image click to open modal
  const handleImageClick = (imageUrl, altText) => {
    setSelectedImageUrl(imageUrl);
    setSelectedImageAlt(altText);
    setOpenImageModal(true);
  };

  // Handler to close the image modal
  const handleCloseImageModal = () => {
    setOpenImageModal(false);
    setSelectedImageUrl("");
    setSelectedImageAlt("");
  };

  return (
    <Box
      sx={{ maxWidth: 900, margin: "auto", p: { xs: 2, md: 3 }, bgcolor: "#f5f5f5", borderRadius: 2 }}
    >
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ textAlign: "center", mb: 3, color: "primary.main", fontWeight: "bold" }}
      >
        Programs Under My Supervision
      </Typography>

      <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
        <TextField
          fullWidth
          placeholder="Search programs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: <InfoOutlinedIcon sx={{ mr: 1, color: "action.active" }} />,
          }}
          sx={{ maxWidth: 400, bgcolor: "background.paper", borderRadius: 1 }}
        />
      </Box>

      {totalCount > 0 && !isLoading && (
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          sx={{ mb: 2, flexWrap: "wrap", justifyContent: "center" }}
        >
          <Chip
            icon={
              <Tooltip title="Total number of programs" placement="top">
                <AssessmentIcon />
              </Tooltip>
            }
            label={`Total: ${totalCount}`}
            variant="outlined"
            color="primary"
            sx={{
              transition: "transform 0.2s",
              "&:hover": { transform: "scale(1.05)" },
            }}
          />
          <Chip
            icon={
              <Tooltip title="Current page" placement="top">
                <FormatListNumberedIcon />
              </Tooltip>
            }
            label={`Page: ${page} / ${totalPages}`}
            variant="outlined"
            color="secondary"
            sx={{
              transition: "transform 0.2s",
              "&:hover": { transform: "scale(1.05)" },
            }}
          />
          <Chip
            icon={
              <Tooltip title="Items per page" placement="top">
                <ListIcon />
              </Tooltip>
            }
            label={`Per Page: ${ITEMS_PER_PAGE}`}
            variant="outlined"
            color="primary"
            sx={{
              transition: "transform 0.2s",
              "&:hover": { transform: "scale(1.05)" },
            }}
          />
        </Stack>
      )}

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
          <CircularProgress size={60} />
        </Box>
      ) : errorMessage && programs.length === 0 ? (
        <Paper elevation={2} sx={{ p: 3, textAlign: "center", mt: 3 }}>
          <Typography variant="subtitle1" sx={{ color: "text.secondary" }}>
            {debouncedSearchTerm
              ? `No programs found for "${debouncedSearchTerm}".`
              : "You have no supervised programs."}
          </Typography>
        </Paper>
      ) : (
        <>
          <Grid container spacing={3}>
            {programs.map((program, index) => {
              const approvalProps = (() => {
                switch (program.approvalStatus) {
                  case 1:
                    return {
                      label: "Approved",
                      color: "success",
                      icon: <CheckCircleOutlineIcon fontSize="small" />,
                    };
                  case 2:
                    return {
                      label: "Rejected",
                      color: "error",
                      icon: <CancelIcon fontSize="small" />,
                    };
                  default:
                    return {
                      label: "Pending",
                      color: "warning",
                      icon: <HourglassEmptyIcon fontSize="small" />,
                    };
                }
              })();
              const statusProps = program.status
                ? { label: "Active", color: "success" }
                : { label: "Inactive", color: "default" };

              const imageUrl = program.imagePath || "https://via.placeholder.com/600x400.png?text=No+Image";
              const imageAlt = program.title || "Program image";

              return (
                <Grid item xs={12} sm={6} md={4} key={program.trainingProgramId}>
                  <Fade in timeout={300 + index * 100}>
                    <StyledCard elevation={2}>
                      <Tooltip title={`View ${program.title}'s Image`} placement="top">
                        <CardMedia
                          component="img"
                          sx={{
                            width: "100%",
                            height: 200,
                            objectFit: "contain",
                            bgcolor: "#e0e0e0",
                            cursor: "pointer", // Add cursor pointer to indicate clickability
                            "&:hover": {
                                opacity: 0.8, // Slight dim on hover
                            },
                          }}
                          image={imageUrl}
                          alt={imageAlt}
                          onClick={() => handleImageClick(imageUrl, imageAlt)} // Add onClick handler
                        />
                      </Tooltip>
                      <CardContent sx={{ flexGrow: 1, p: 2 }}>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                          <Typography variant="subtitle2" color="text.secondary" noWrap>
                            #
                          </Typography>
                          <Tooltip title="Training Program ID" placement="top">
                            <Typography variant="subtitle2" color="text.secondary" noWrap>
                              {program.trainingProgramId}
                            </Typography>
                          </Tooltip>
                        </Stack>

                        <Tooltip title="Program Title" placement="top">
                          <Typography
                            gutterBottom
                            variant="h5"
                            component="div"
                            noWrap
                            sx={{ fontWeight: "medium", display: "inline-block" }}
                          >
                            {program.title}
                          </Typography>
                        </Tooltip>

                        <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: "wrap" }}>
                          <Tooltip title="Category Name" placement="top">
                            <Chip
                              icon={<CategoryIcon />}
                              label={program.categoryName || "N/A"}
                              size="small"
                              variant="outlined"
                              color="info"
                              sx={{
                                transition: "transform 0.2s",
                                "&:hover": { transform: "scale(1.05)" },
                              }}
                            />
                          </Tooltip>
                          <Tooltip title="Approval Status" placement="top">
                            <Chip
                              icon={approvalProps.icon}
                              label={approvalProps.label}
                              size="small"
                              color={approvalProps.color}
                              variant="outlined"
                              sx={{
                                transition: "transform 0.2s",
                                "&:hover": { transform: "scale(1.05)" },
                              }}
                            />
                          </Tooltip>
                          <Tooltip title="Program Active Status" placement="top">
                            <Chip
                              label={statusProps.label}
                              size="small"
                              color={statusProps.color}
                              variant="outlined"
                              sx={{
                                transition: "transform 0.2s",
                                "&:hover": { transform: "scale(1.05)" },
                              }}
                            />
                          </Tooltip>
                        </Stack>

                        {program.rating !== null && program.rating > 0 && (
                          <Tooltip title="Degree of Difficulty" placement="top">
                            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 1 }}>
                              <Rating
                                value={program.rating}
                                precision={0.1}
                                readOnly
                                size="small"
                                emptyIcon={<StarBorderIcon fontSize="inherit" />}
                                sx={{
                                  "&:hover": {
                                    transform: "scale(1.2)",
                                  },
                                  transition: "transform 0.2s",
                                }}
                              />
                              <Typography variant="body2" color="text.secondary">
                                ({program.rating.toFixed(1)})
                              </Typography>
                            </Stack>
                          </Tooltip>
                        )}

                        <Tooltip title="Program Description" placement="top">
                          <Typography
                            variant="body1"
                            color="text.primary"
                            sx={{
                              mb: 2,
                              whiteSpace: "pre-wrap",
                              wordBreak: "break-word",
                            }}
                          >
                            {program.description}
                          </Typography>
                        </Tooltip>

                        <Box>
                          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                            <Tooltip title="Duration" placement="top">
                              <AccessTimeIcon sx={{ color: "text.secondary" }} />
                            </Tooltip>
                            <Tooltip title="Duration Value" placement="top">
                              <Typography variant="body2" color="text.secondary">
                                {program.durationInDays}
                              </Typography>
                            </Tooltip>
                          </Stack>

                          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                            <Tooltip title="Location" placement="top">
                              <LocationOnIcon sx={{ color: "text.secondary" }} />
                            </Tooltip>
                            <Tooltip title="Location Value" placement="top">
                              <Typography variant="body2" color="text.secondary">
                                {program.location || "N/A"}
                              </Typography>
                            </Tooltip>
                          </Stack>

                          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                            <Tooltip title="Start Date" placement="top">
                              <EventIcon sx={{ color: "text.secondary" }} />
                            </Tooltip>
                            <Tooltip title="Start Date Value" placement="top">
                              <Typography variant="body2" color="text.secondary">
                                {formatDate(program.startDate)}
                              </Typography>
                            </Tooltip>
                          </Stack>

                          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                            <Tooltip title="End Date" placement="top">
                              <EventIcon sx={{ color: "text.secondary" }} />
                            </Tooltip>
                            <Tooltip title="End Date Value" placement="top">
                              <Typography variant="body2" color="text.secondary">
                                {formatDate(program.endDate)}
                              </Typography>
                            </Tooltip>
                          </Stack>

                          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                            <Tooltip title="Seats Available" placement="top">
                              <PeopleOutlineIcon sx={{ color: "text.secondary" }} />
                            </Tooltip>
                            <Tooltip title="Seats Value" placement="top">
                              <Typography variant="body2" color="text.secondary">
                                {`${program.seatsAvailable} available`}
                              </Typography>
                            </Tooltip>
                          </Stack>

                          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                            <Tooltip title="Company Name" placement="top">
                              <BusinessIcon sx={{ color: "text.secondary" }} />
                            </Tooltip>
                            <Tooltip title="Company Value" placement="top">
                              <Typography variant="body2" color="text.secondary">
                                {program.companyName || "N/A"}
                              </Typography>
                            </Tooltip>
                          </Stack>

                          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                            <Tooltip title="Created Date" placement="top">
                              <UpdateIcon sx={{ color: "text.secondary" }} />
                            </Tooltip>
                            <Tooltip title="Created Value" placement="top">
                              <Typography variant="body2" color="text.secondary">
                                {formatDate(program.createdAt)}
                              </Typography>
                            </Tooltip>
                          </Stack>
                        </Box>
                      </CardContent>

                      <CardActions sx={{ borderTop: "1px solid #eee", bgcolor: "grey.50", p: 1 }}>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<LinkIcon />}
                          href={program.contentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          disabled={!program.contentUrl}
                          fullWidth
                          sx={{
                            mr: 0.5,
                            textTransform: "none",
                            transition: "background-color 0.2s",
                            "&:hover": { bgcolor: "primary.light" },
                          }}
                        >
                          Content
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          startIcon={<SchoolIcon />}
                          href={program.classroomUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          disabled={!program.classroomUrl}
                          fullWidth
                          sx={{
                            ml: 0.5,
                            textTransform: "none",
                            transition: "background-color 0.2s",
                            "&:hover": { bgcolor: "primary.dark" },
                          }}
                        >
                          Classroom
                        </Button>
                      </CardActions>
                    </StyledCard>
                  </Fade>
                </Grid>
              );
            })}
          </Grid>

          {totalPages > 0 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                showFirstButton
                showLastButton
                sx={{
                  "& .MuiPaginationItem-root": {
                    transition: "transform 0.2s",
                    "&:hover": { transform: "scale(1.1)" },
                  },
                }}
              />
            </Box>
          )}
        </>
      )}

      {/* Image Preview Dialog */}
      <Dialog
        open={openImageModal}
        onClose={handleCloseImageModal}
        maxWidth="md"
        fullWidth
        aria-labelledby="image-preview-dialog-title"
      >
        <DialogContent sx={{ p: 0, position: "relative" }}>
          <IconButton
            aria-label="close"
            onClick={handleCloseImageModal}
            sx={{
              width: 'fit-content',
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
              zIndex: 1, // Ensure close button is above the image
            }}
          >
            <CloseIcon />
          </IconButton>
          <img
            src={selectedImageUrl}
            alt={selectedImageAlt}
            style={{ width: "50%", height: "auto", display: "block", margin: 'auto' }}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
}