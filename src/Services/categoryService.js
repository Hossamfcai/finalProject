import axios from "axios";

export async function getCategoriesService() {
  try {
    const responese = await axios.get(
      "http://localhost:5000/api/v1/categories",
    );

    return responese.data.data;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
}
