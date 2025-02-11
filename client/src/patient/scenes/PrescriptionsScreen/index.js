import {
  useAddToCartMutation,
  useGetPatientQuery,
  useUpdatePrescriptionsQuantityMutation,
} from "../../../store";
import { Box, Card, Typography, Divider, Button, Avatar } from "@mui/joy";
import { FaCartPlus } from "react-icons/fa";
import "./styles.css";
import LoadingIndicator from "../../../shared/components/LoadingIndicator";

const PrescriptionsScreen = () => {
  const { data: patient, isFetching, error } = useGetPatientQuery();
  const [addToCart] = useAddToCartMutation();
  const [updatePrescriptionsQuantity] = useUpdatePrescriptionsQuantityMutation();

  if (isFetching) {
    return <LoadingIndicator />;
  }
  console.log(patient);

  console.log(patient.prescriptions);
  const arr = [];
  for (let i = 0; i < patient.prescriptions.length; i++) {
    for (let j = 0; j < patient.prescriptions[i].medicines.length; j++) {
      arr.push({
        prescriptionId: patient.prescriptions[i]._id,
        medicine: patient.prescriptions[i].medicines[j],
      });
    }
  }
  console.log(arr);

  const handleAddToCartClick = async ({ prescriptionId, item }) => {
    await addToCart({
      name: item.medicine.name,
    });
    await updatePrescriptionsQuantity({
      prescriptionId: prescriptionId,
      medicineId: item.medicine._id,
    });
    // console.log("add cart pres:", prescriptionId);
    return 0;
  };

  const mappedArray = arr.map(({ prescriptionId, medicine: item }) => {
    if (item.quantity === 0) return null;
    const isInStock = item.medicine.quantity !== 0;
    let urlImage =
      "https://www.shutterstock.com/image-vector/vector-illustration-medicine-jar-on-260nw-1352994935.jpg";
    const bytesImage = new Uint8Array(item.medicine.medicineImage.data.data);
    const blobImage = new Blob([bytesImage], { type: item.medicine.medicineImage.contentType });
    urlImage = URL.createObjectURL(blobImage);
    return (
      <Card className="mb-5 bg-white text-black">
        <Box className="p-4">
          {/* Flex container to hold both parts of the text */}
          <div className="flex items-end">
            {/* First part of the text */}
            <Typography
              component="span" // 'span' to keep it inline
              level="h2" // Made larger
              fontWeight={700} // Make it bolder
              className="mr-2" // Add some margin to the right
            >
              {item.medicine.name}
            </Typography>
            {/* Second part of the text */}
            <Typography
              component="span" // 'span' to keep it inline
              level="h4" // Made larger
              fontWeight={500} // Slightly less bold
            >
              ({item.medicine.medicinalUse})
            </Typography>
          </div>
          <Divider />
          <br />
          <div className="prescription-container">
            <img className="prescription-image" src={urlImage} alt="Aspirin Logo" />
            <div>
              <Typography variant="h5" component="div" fontWeight={500}>
                Dosage: {item.dosage} pill
              </Typography>
              <Typography variant="h5" component="div" fontWeight={500}>
                Duration: {item.duration}
              </Typography>
              <Typography variant="h5" component="div" fontWeight={500}>
                Frequency: {item.frequency}
              </Typography>
              <Typography variant="h5" component="div" fontWeight={500}>
                Needed quantity: {item.quantity}
              </Typography>
            </div>
          </div>
          <div className="blue-imp-button-container">
            {isInStock ? (
              <Button
                variant="contained"
                className="absolute bottom-0 left-0 m-4 bg-blue-1000 hover:bg-black text-white w-22 blue-imp-button" // w-10 is 40px in Tailwind CSS
                onClick={() => {
                  /* Add to cart logic */
                  handleAddToCartClick({ prescriptionId, item });
                }}
              >
                <FaCartPlus className="mr-2" />
                Add to Cart
              </Button>
            ) : (
              <Typography variant="h5" component="div" fontWeight={500}>
                Not in stock
              </Typography>
            )}
          </div>
        </Box>
      </Card>
    );
  });

  return (
    <Box className="mx-20 my-10">
      <Typography level="h1" fontWeight={700}>
        My Prescriptions
      </Typography>
      <Divider sx={{ my: 2 }} />
      {mappedArray}
    </Box>
  );
};

export default PrescriptionsScreen;
