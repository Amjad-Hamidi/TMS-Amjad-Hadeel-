import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Stack,
  Button,
  Pagination,
  CircularProgress,
  TextField,
  Chip,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import CategoryIcon from "@mui/icons-material/Category";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium"; // Icon for Content
import ClassIcon from "@mui/icons-material/Class"; // Icon for Classroom
import { fetchWithAuth } from "../utils/fetchWithAuth";

const LIMIT = 10;

export default function TraineePrograms() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [meta, setMeta] = useState({
    totalCount: 0,
    page: 1,
    limit: LIMIT,
    totalPages: 1,
  });
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // New state for image preview

  // حساب الحالة الفعلية (Start Soon / On Going / Finished)
  const computeStatus = (startDateStr, endDateStr) => {
    const now = new Date();
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    if (now < start) return "Start Soon";
    if (now >= start && now <= end) return "On Going";
    return "Finished";
  };

  // جلب البرامج من الـ API
  const fetchPrograms = async (page = 1, limit = LIMIT, searchTerm = "") => {
    setLoading(true);
    setError("");
    try {
      let url = `https://amjad-hamidi-tms.runasp.net/api/ProgramEnrollments/my-enrollments?page=${page}&limit=${limit}`;
      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`;
      }
      const response = await fetchWithAuth(url, { headers: { Accept: "*/*" } });
      if (!response.ok) throw new Error("Failed to fetch programs.");
      const data = await response.json();

      const enriched = (data.items || []).map((p) => ({
        id: p.trainingProgramId,
        title: p.title,
        imagePath: p.imagePath,
        category: p.categoryName,
        start: p.startDate?.split("T")[0] || "",
        end: p.endDate?.split("T")[0] || "",
        status: computeStatus(p.startDate, p.endDate),
        description: p.description || "No description provided.",
        duration: p.durationInDays ? `${p.durationInDays} days` : "N/A",
        location: p.location || "TBD",
        contentUrl: p.contentUrl || "#",
        classroomUrl: p.classroomUrl || "#",
        supervisor: p.supervisorName || "N/A",
      }));

      setPrograms(enriched);
      setMeta({
        totalCount: data.totalCount || 0,
        page: data.page || 1,
        limit: data.limit || LIMIT,
        totalPages: data.totalPages || 1,
      });
    } catch (err) {
      setError(err.message || "Error loading programs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms(meta.page, meta.limit, search);
    // eslint-disable-next-line
  }, [meta.page]);

  // عند تغيير نص البحث مع تأخير بسيط
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    setMeta((prev) => ({ ...prev, page: 1 }));
    if (searchTimeout) clearTimeout(searchTimeout);
    setSearchTimeout(
      setTimeout(() => {
        fetchPrograms(1, meta.limit, value);
      }, 500)
    );
  };

  // عند تغيير الصفحة في Pagination
  const handlePageChange = (event, value) => {
    setMeta((prev) => ({ ...prev, page: value }));
  };

  // إغلاق نافذة المعاينة
  const handleCloseProgramDialog = () => setSelectedProgram(null);
  // إغلاق نافذة معاينة الصورة
  const handleCloseImageDialog = () => setSelectedImage(null);

  return (
    <>
      <Box
        sx={{
          width: "100%",
          maxWidth: 1100,
          mx: "auto",
          minHeight: "100vh",           
          overflowY: "auto", // for Scrolling           
          py: 4,
          boxSizing: "border-box",
          paddingLeft: "60px",
        }}
      >
        {/* ─── العنوان وحقل البحث والإحصائيات ──────────────────────────────────────── */}
        <Typography variant="h4" mb={2} fontWeight={700} color="primary">
          Trainee Programs
        </Typography>

        <TextField
          label="Search Programs"
          variant="outlined"
          value={search}
          onChange={handleSearchChange}
          sx={{ mb: 3, width: 400 }}
        />

        <Stack direction="row" spacing={1} mb={3}>
          <Chip label={`Total: ${meta.totalCount}`} color="primary" />
          <Chip
            label={`Page: ${meta.page} / ${meta.totalPages}`}
            color="secondary"
          />
          <Chip label={`Limit: ${meta.limit}`} color="primary" />
        </Stack>

        {/* ─── حالة التحميل أو الخطأ أو عرض البطاقات ───────────────────────────────── */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <> {/* ─── شبكة البطاقات (Cards) ───────────────────────────────────────────── */}
            <Stack direction="row" flexWrap="wrap" gap={3}>
              {programs.length === 0 ? (
                <Typography>No programs found.</Typography>
              ) : (
                programs.map((p) => (
                  <Card
                    key={p.id}
                    sx={{
                      width: 300,
                      borderRadius: 2,
                      boxShadow: 3,
                      cursor: 'pointer',
                      transition:
                        "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.03)",
                        boxShadow: 6,
                      },
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {p.imagePath && (
                      <CardMedia
                        component="img"
                        height="160"
                        image={p.imagePath}
                        alt={p.title}
                        sx={{ objectFit: "cover" }}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent card's onClick from firing
                          setSelectedImage(p.imagePath);
                        }}
                      />
                    )}
                    <CardContent sx={{ flexGrow: 1 }} onClick={() => setSelectedProgram(p)}> {/* Added onClick here */}
                      <Typography
                        variant="h6"
                        fontWeight={700}
                        gutterBottom
                        textAlign="center"
                      >
                        #{p.id} — {p.title}
                      </Typography>
                      <Chip
                        label={p.status}
                        size="small"
                        sx={{ mb: 1 }}
                        color={
                          p.status === "Start Soon"
                            ? "warning"
                            : p.status === "On Going"
                              ? "success"
                              : "default"
                        }
                      />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        mb={2}
                        sx={{ whiteSpace: "pre-line" }}
                      >
                        {p.description}
                      </Typography>
                      <Stack direction="column" spacing={1} sx={{ mb: 2 }}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Tooltip title="Supervisor Name">
                            <SupervisorAccountIcon fontSize="small" color="action" />
                          </Tooltip>
                          <Typography variant="body2" color="text.primary">
                            {p.supervisor}
                          </Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Tooltip title="Category">
                            <CategoryIcon fontSize="small" color="action" />
                          </Tooltip>
                          <Typography variant="body2" color="text.primary">
                            {p.category}
                          </Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Tooltip title="Duration">
                            <AccessTimeIcon fontSize="small" color="action" />
                          </Tooltip>
                          <Typography variant="body2" color="text.primary">
                            {p.duration}
                          </Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Tooltip title="Start ↔ End">
                            <CalendarTodayIcon fontSize="small" color="action" />
                          </Tooltip>
                          <Typography variant="body2" color="text.primary">
                            {p.start} ↔ {p.end}
                          </Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Tooltip title="Location">
                            <LocationOnIcon fontSize="small" color="action" />
                          </Tooltip>
                          <Typography variant="body2" color="text.primary">
                            {p.location}
                          </Typography>
                        </Stack>
                      </Stack>
                      <Stack direction="row" spacing={2} justifyContent="center">
                        <Button
                          component="a"
                          href={p.contentUrl}
                          target="_blank"
                          rel="noopener"
                          variant="contained"
                          size="small"
                          startIcon={<WorkspacePremiumIcon />}
                        >
                          Content
                        </Button>
                        <Button
                          component="a"
                          href={p.classroomUrl}
                          target="_blank"
                          rel="noopener"
                          variant="outlined"
                          size="small"
                          startIcon={<ClassIcon />}
                        >
                          Classroom
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                ))
              )}
            </Stack>
            <Box mt={4} display="flex" justifyContent="center">
              <Pagination
                count={meta.totalPages}
                page={meta.page}
                onChange={handlePageChange}
                color="primary"
                shape="rounded"
              />
            </Box>
          </>
        )}
      </Box>

      {/* ─── نافذة المعاينة الكاملة (Program Details) ────────────────────────────────────────────────── */}
      <Dialog
        open={Boolean(selectedProgram)}
        onClose={handleCloseProgramDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
          {selectedProgram?.title}
          <IconButton
            aria-label="close"
            onClick={handleCloseProgramDialog}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedProgram && (
            <Card sx={{ boxShadow: 'none' }}>
              {selectedProgram.imagePath && (
                <CardMedia
                  component="img"
                  height="200"
                  image={selectedProgram.imagePath}
                  alt={selectedProgram.title}
                  sx={{ objectFit: 'cover' }}
                />
              )}
              <CardContent>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  {selectedProgram.description}
                </Typography>
                <Stack direction="column" spacing={1} sx={{ mb: 2 }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <SupervisorAccountIcon fontSize="small" color="action" />
                    <Typography variant="body2">{selectedProgram.supervisor}</Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <CategoryIcon fontSize="small" color="action" />
                    <Typography variant="body2">{selectedProgram.category}</Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <AccessTimeIcon fontSize="small" color="action" />
                    <Typography variant="body2">{selectedProgram.duration}</Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <CalendarTodayIcon fontSize="small" color="action" />
                    <Typography variant="body2">{selectedProgram.start} ↔ {selectedProgram.end}</Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <LocationOnIcon fontSize="small" color="action" />
                    <Typography variant="body2">{selectedProgram.location}</Typography>
                  </Stack>
                </Stack>
                <Stack direction="row" spacing={2} justifyContent="center">
                  <Button
                    component="a"
                    href={selectedProgram.contentUrl}
                    target="_blank"
                    rel="noopener"
                    variant="contained"
                    size="small"
                    startIcon={<WorkspacePremiumIcon />}
                  >
                    Content
                  </Button>
                  <Button
                    component="a"
                    href={selectedProgram.classroomUrl}
                    target="_blank"
                    rel="noopener"
                    variant="outlined"
                    size="small"
                    startIcon={<ClassIcon />}
                  >
                    Classroom
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          )}
        </DialogContent>
      </Dialog>

      {/* ─── نافذة معاينة الصورة فقط (بدون DialogTitle لعدم وجود الخط) ────────────────── */}
      <Dialog
        open={Boolean(selectedImage)}
        onClose={handleCloseImageDialog}
        maxWidth="md"
        fullWidth
      >
        {/*
          تمت إزالة DialogTitle هنا لمنع ظهور الخط الزائد.
          زر الإغلاق سيتم وضعه مباشرة داخل DialogContent.
        */}
        <DialogContent
          dividers // يمكنك إزالة هذا إذا كان هو مصدر الخط الفاصل بين المحتوى والزر
          sx={{ position: 'relative', p: 0 }} // p: 0 لإزالة الـ padding الافتراضي، ثم سنضيف padding يدوي للصورة
        >
          <IconButton
            aria-label="close"
            onClick={handleCloseImageDialog}
            sx={{
              width: 'fit-content',
              position: 'absolute',
              right: 8,
              top: 8,
              zIndex: 1, // لضمان ظهور الزر فوق الصورة
              backgroundColor: 'rgba(3, 53, 110, 0.7)', // خلفية خفيفة لمساعدة الرؤية على الصورة
              '&:hover': {
                backgroundColor: 'rgba(131, 203, 245, 0.9)',
              }
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
                width: '50%',
                height: 'auto',
                maxHeight: '80vh', // حد أقصى للارتفاع لكي لا تكون الصورة كبيرة جدًا
                display: 'block',
                mx: 'auto',
                objectFit: 'contain',
                p: 2, // إضافة padding للصورة نفسها بدلاً من DialogTitle
                margin: 'auto',
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}