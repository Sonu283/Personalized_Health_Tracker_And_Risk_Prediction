from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware
# import h5py
import os
from model_utils import predict_from_csv

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.post("/predictecg")
async def predict_ecg(file: UploadFile = File(...)):
    try:
        df = pd.read_csv(file.file)
        prediction, confidence = predict_from_csv(df)
        return {
            "predicted_class": int(prediction),
            "confidence_percent": round(confidence * 100, 2)
        }
    except Exception as e:
        return JSONResponse(status_code=400, content={"error": str(e)})

# @app.post("/convert-hdf5")
# async def convert_hdf5_to_csv(file: UploadFile = File(...)):
#     try:
#         os.makedirs("temp", exist_ok=True)
#         file_path = f"temp/{file.filename}"
#         with open(file_path, "wb") as f:
#             f.write(await file.read())

#         with h5py.File(file_path, 'r') as hf:
#             key = list(hf.keys())[0]
#             data = hf[key][:]
#             df = pd.DataFrame(data)

#         csv_path = file_path.replace(".hdf5", ".csv")
#         df.to_csv(csv_path, index=False)

#         return {
#             "message": "Conversion successful",
#             "rows": df.shape[0],
#             "columns": df.shape[1],
#             "csv_file": os.path.basename(csv_path)
#         }
#     except Exception as e:
#         return JSONResponse(status_code=400, content={"error": str(e)})
