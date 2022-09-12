import { Card, CardContent, TextField, Typography } from "@material-ui/core";
import { Button } from "@saleor/components/Button";
import {
  CollectionErrorFragment,
  PageErrorFragment,
  ProductErrorFragment,
} from "@saleor/graphql";
import { makeStyles } from "@saleor/macaw-ui";
import { getFieldError, getProductErrorMessage } from "@saleor/utils/errors";
import getPageErrorMessage from "@saleor/utils/errors/page";
import classNames from "classnames";
import React from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";
import slugify from "slugify";

import CardTitle from "../CardTitle";
import FormSpacer from "../FormSpacer";

enum SeoField {
  slug = "slug",
  title = "seoTitle",
  description = "seoDescription",
}

const SLUG_REGEX = /^[a-zA-Z0-9\-\_]+$/;
const maxSlugLength = 255;
const maxTitleLength = 70;
const maxDescriptionLength = 300;

const useStyles = makeStyles(
  theme => ({
    addressBar: {
      color: "#006621",
      fontSize: "13px",
      lineHeight: "16px",
      marginBottom: "2px",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    container: {
      width: "100%",
    },
    descriptionBar: {
      color: "#545454",
      fontSize: "13px",
      lineHeight: "18px",
      overflowWrap: "break-word",
    },
    helperText: {
      marginBottom: theme.spacing(3),
    },
    label: {
      flex: 1,
    },
    labelContainer: {
      "& span": {
        paddingRight: 30,
      },
      display: "flex",
    },
    preview: {
      minHeight: theme.spacing(10),
    },
    title: {
      padding: 0,
    },
    titleBar: {
      color: "#1a0dab",
      fontSize: "18px",
      lineHeight: "21px",
      overflowWrap: "break-word",
      textDecoration: "none",
      wordWrap: "break-word",
    },
  }),
  { name: "SeoForm" },
);

interface SeoFormProps {
  description?: string | null;
  descriptionPlaceholder: string;
  disabled?: boolean;
  errors?: Array<
    PageErrorFragment | ProductErrorFragment | CollectionErrorFragment
  >;
  loading?: boolean;
  helperText?: string;
  allowEmptySlug?: boolean;
  title: string | null;
  slug: string;
  slugPlaceholder?: string;
  titlePlaceholder: string;
  onChange(event: any);
  onClick?();
}

const SeoForm: React.FC<SeoFormProps> = props => {
  const {
    description,
    descriptionPlaceholder,
    disabled,
    errors = [],
    helperText,
    allowEmptySlug = false,
    loading,
    title,
    slug,
    slugPlaceholder,
    titlePlaceholder,
    onChange,
  } = props;
  const classes = useStyles(props);

  const intl = useIntl();

  const [expanded, setExpansionStatus] = React.useState(false);

  const toggleExpansion = () => setExpansionStatus(!expanded);

  const shouldDisplayHelperText = helperText && !expanded;

  const { seoFieldMessage } = defineMessages({
    seoFieldMessage: {
      id: "s/sTT6",
      defaultMessage: "If empty, the preview shows what will be autogenerated.",
    },
  });

  const getSlugHelperMessage = () => {
    const error = !!getError(SeoField.slug);

    if (allowEmptySlug && !error) {
      return intl.formatMessage(seoFieldMessage);
    }

    return error ? getSlugErrorMessage() : "";
  };

  const getSlugErrorMessage = () => {
    const error = getError(SeoField.slug);
    const { __typename: type } = error;

    return type === "ProductError"
      ? getProductErrorMessage(error as ProductErrorFragment, intl)
      : getPageErrorMessage(error as PageErrorFragment, intl);
  };

  const handleSlugChange = (event: React.ChangeEvent<any>) => {
    const { value } = event.target;

    if (value === "" || SLUG_REGEX.test(value)) {
      onChange(event);
    }
  };

  const getError = (fieldName: SeoField) => getFieldError(errors, fieldName);

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          id: "TGX4T1",
          defaultMessage: "Search Engine Preview",
        })}
        toolbar={
          <Button
            variant="tertiary"
            onClick={toggleExpansion}
            data-test-id="edit-seo"
          >
            <FormattedMessage
              id="s5Imt5"
              defaultMessage="Edit website SEO"
              description="button"
            />
          </Button>
        }
      />
      <CardContent>
        {shouldDisplayHelperText && (
          <Typography
            className={classNames({ [classes.helperText]: expanded })}
          >
            {helperText}
          </Typography>
        )}
        {expanded && (
          <div className={classes.container}>
            <TextField
              error={!!getError(SeoField.slug) || slug.length > maxSlugLength}
              name={SeoField.slug}
              label={
                <div className={classes.labelContainer}>
                  <div className={classes.label}>
                    <FormattedMessage id="IoDlcd" defaultMessage="Slug" />
                  </div>
                  {slug?.length > 0 && (
                    <span>
                      <FormattedMessage
                        id="ChAjJu"
                        defaultMessage="{numberOfCharacters} of {maxCharacters} characters"
                        description="character limit"
                        values={{
                          maxCharacters: maxSlugLength,
                          numberOfCharacters: slug?.length,
                        }}
                      />
                    </span>
                  )}
                </div>
              }
              InputProps={{
                inputProps: {
                  maxLength: maxSlugLength,
                },
              }}
              helperText={getSlugHelperMessage()}
              value={slug}
              disabled={loading || disabled}
              placeholder={slug || slugify(slugPlaceholder, { lower: true })}
              onChange={handleSlugChange}
              fullWidth
            />
            <FormSpacer />
            <TextField
              error={title?.length > maxTitleLength}
              name={SeoField.title}
              label={
                <div className={classes.labelContainer}>
                  <div className={classes.label}>
                    <FormattedMessage
                      id="w2Cewo"
                      defaultMessage="Search engine title"
                    />
                  </div>
                  {title?.length > 0 && (
                    <span>
                      <FormattedMessage
                        id="ChAjJu"
                        defaultMessage="{numberOfCharacters} of {maxCharacters} characters"
                        description="character limit"
                        values={{
                          maxCharacters: maxTitleLength,
                          numberOfCharacters: title.length,
                        }}
                      />
                    </span>
                  )}
                </div>
              }
              InputProps={{
                inputProps: {
                  maxLength: maxTitleLength,
                },
              }}
              helperText={intl.formatMessage(seoFieldMessage)}
              value={title ?? ""}
              disabled={loading || disabled}
              placeholder={titlePlaceholder}
              onChange={onChange}
              fullWidth
            />
            <FormSpacer />
            <TextField
              error={description?.length > maxDescriptionLength}
              name={SeoField.description}
              label={
                <div className={classes.labelContainer}>
                  <div className={classes.label}>
                    <FormattedMessage
                      id="CXTIq8"
                      defaultMessage="Search engine description"
                    />
                  </div>
                  {description?.length > 0 && (
                    <span>
                      <FormattedMessage
                        id="ChAjJu"
                        defaultMessage="{numberOfCharacters} of {maxCharacters} characters"
                        description="character limit"
                        values={{
                          maxCharacters: maxDescriptionLength,
                          numberOfCharacters: description.length,
                        }}
                      />
                    </span>
                  )}
                </div>
              }
              helperText={intl.formatMessage(seoFieldMessage)}
              InputProps={{
                inputProps: {
                  maxLength: maxDescriptionLength,
                },
              }}
              value={description ?? ""}
              onChange={onChange}
              disabled={loading || disabled}
              fullWidth
              multiline
              placeholder={descriptionPlaceholder}
              rows={10}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
SeoForm.displayName = "SeoForm";
export default SeoForm;
