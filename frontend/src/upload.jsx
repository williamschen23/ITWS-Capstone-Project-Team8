import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/ui/shadcn-io/dropzone";
import { useState } from "react";

export function UploadForm() {
  const [files, setFiles] = useState();

  const handleDrop = (files) => {
    setFiles(files);
  };

  return (
    <div className="w-full max-w-md">
      <form>
        <FieldGroup>
          <FieldSet>
            <FieldLegend>Upload Point Cloud</FieldLegend>
            <FieldGroup>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  {" "}
                  <Dropzone
                    minSize={1024}
                    onDrop={handleDrop}
                    onError={console.error}
                    src={files}
                  >
                    <DropzoneEmptyState />
                    <DropzoneContent />
                  </Dropzone>
                </div>
                <div>
                  <Field>
                    <FieldLabel htmlFor="object-name">Object Name</FieldLabel>
                    <Input id="object-name" placeholder="Apartment" required />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="object-description">
                      Description
                    </FieldLabel>
                    <Textarea
                      id="object-description"
                      placeholder="Brief description of the object"
                      className="resize-none"
                    />
                  </Field>
                </div>
              </div>
            </FieldGroup>
          </FieldSet>
          <Field orientation="horizontal">
            <Button type="submit">Upload</Button>
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
