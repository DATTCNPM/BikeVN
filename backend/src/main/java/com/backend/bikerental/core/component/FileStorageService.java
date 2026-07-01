package com.backend.bikerental.core.component;

import com.backend.bikerental.core.exception.AppException;
import com.backend.bikerental.core.exception.ErrorCode;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class FileStorageService {
    Cloudinary cloudinary;

    public String storeVehicleImage(MultipartFile file)
    {
        return storeFile(file, "vehicle-images");
    }

    public List<String> storeVehicleReturnImages(List<MultipartFile> files)
    {
        if (files == null || files.isEmpty())
        {
            throw new AppException(ErrorCode.FILE_UPLOAD_FAILED);
        }

        return files.stream()
                .map(file -> storeFile(file, "vehicle-return-images"))
                .collect(Collectors.toList());
    }

    private String storeFile(MultipartFile file, String subFolder)
    {
        if(file == null || file.isEmpty())
        {
            throw new AppException(ErrorCode.FILE_UPLOAD_FAILED);
        }

        try {
            String publicId = UUID.randomUUID().toString();

            Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", "bikevn/" + subFolder,
                            "publicId", publicId
                    ));

            return uploadResult.get("secure_url").toString();
        }
        catch (IOException exception)
        {
            log.error("Cloudinary upload failed for subfolder: {}", subFolder, exception);
            throw new AppException(ErrorCode.FILE_UPLOAD_FAILED);
        }
    }

    public void delete(String imgUrl)
    {
        if(imgUrl == null || imgUrl.isBlank())
        {
            return;
        }
        try {
            String folderPrefix = "bikevn/";
            int folderIndex = imgUrl.indexOf(folderPrefix);

            if (folderIndex != -1)
            {
                String pathWithExtension = imgUrl.substring(folderIndex);
                int dotIndex = pathWithExtension.lastIndexOf(".");
                String publicId = (dotIndex != -1) ? pathWithExtension.substring(0, dotIndex)
                        : pathWithExtension;

                cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
                log.info("Successfully deleted image from Cloudinary: {}", publicId);
            }

        } catch (IOException e) {
            log.error("Failed to delete image from Cloudinary: {}", imgUrl, e);
            throw new AppException(ErrorCode.FILE_UPLOAD_FAILED);
        }
    }
}