import { IScope, IWindowService } from 'angular';
import * as moment from 'moment';
import { config } from 'config';
import { LanguageService } from 'app/services/languageService';
import { module as mod } from './module';
import { Model } from 'app/entities/model';
import { Class } from 'app/entities/class';
import { Predicate } from 'app/entities/predicate';
import { LanguageContext } from 'app/types/language';

const exportOptions = [
  {type: 'application/ld+json', extension: 'json'},
  {type: 'text/turtle', extension: 'ttl'},
  {type: 'application/rdf+xml', extension: 'rdf'},
  {type: 'application/xml', extension: 'xml'},
  {type: 'application/schema+json', extension: 'json'},
  {type: 'application/ld+json+context', extension: 'json'}
];

const UTF8_BOM = '\ufeff';

mod.directive('export', () => {
  return {
    scope: {
      entity: '=',
      context: '='
    },
    bindToController: true,
    restrict: 'E',
    template: require('./export.html'),
    controllerAs: 'ctrl',
    controller: ExportController
  };
});

type EntityType = Model|Class|Predicate;

function formatFileName(entity: EntityType, extension: string) {
  return `${entity.id.uri.substr('http://'.length)}-${moment().format('YYYY-MM-DD')}.${extension}`;
}

class ExportController {

  entity: Model|Class|Predicate;
  context: LanguageContext;

  downloads: { name: string, filename: string, href: string, hrefRaw: string, onClick?: () => void }[];

  framedUrlObject: string;
  framedUrlObjectRaw: string;
  frameUrlObject: string;
  frameUrlObjectRaw: string;

  /* @ngInject */
  constructor($scope: IScope, $window: IWindowService, languageService: LanguageService) {
    $scope.$watchGroup([() => this.entity, () => languageService.getModelLanguage(this.context)], ([entity, lang]) => {
      const hrefBase = entity instanceof Model ? config.apiEndpointWithName('exportModel') : config.apiEndpointWithName('exportResource');
      this.downloads = exportOptions.map(option => {
        const href = `${hrefBase}?graph=${encodeURIComponent(entity.id.uri)}&content-type=${encodeURIComponent(option.type)}&lang=${lang}`;

        return {
          name: option.type,
          filename: formatFileName(entity, option.extension),
          href,
          hrefRaw: href + '&raw=true'
        };
      });

      if (Modernizr.bloburls) {
        const framedDataAsString = JSON.stringify({'@graph': entity.graph, '@context': entity.context}, null, 2);
        const framedDataBlob = new Blob([UTF8_BOM, framedDataAsString], {type: 'application/ld+json;charset=utf-8'});
        const framedDataBlobRaw = new Blob([UTF8_BOM, framedDataAsString], {type: 'text/plain;charset=utf-8'});

        if (this.framedUrlObject) {
          $window.URL.revokeObjectURL(this.framedUrlObject);
        }

        if (this.framedUrlObjectRaw) {
          $window.URL.revokeObjectURL(this.framedUrlObjectRaw);
        }

        if (this.frameUrlObject) {
          $window.URL.revokeObjectURL(this.frameUrlObject);
        }

        if (this.frameUrlObjectRaw) {
          $window.URL.revokeObjectURL(this.frameUrlObjectRaw);
        }

        this.framedUrlObject = $window.URL.createObjectURL(framedDataBlob);
        this.framedUrlObjectRaw = $window.URL.createObjectURL(framedDataBlobRaw);

        if (this.entity.frame) {
          const frameAsString = JSON.stringify(this.entity.frame, null, 2);
          const frameBlob = new Blob([UTF8_BOM, frameAsString], {type: 'application/json;charset=utf-8'});
          const frameBlobRaw = new Blob([UTF8_BOM, frameAsString], {type: 'text/plain;charset=utf-8'});

          this.frameUrlObject = $window.URL.createObjectURL(frameBlob);
          this.frameUrlObjectRaw = $window.URL.createObjectURL(frameBlobRaw);

          this.downloads.push({
            name: 'ld+json frame',
            filename: 'frame.json',
            href: this.frameUrlObject,
            hrefRaw: this.frameUrlObjectRaw,
            onClick: () => {
              if (window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(frameBlob, 'frame.json');
              }
            }
          });
        }

        this.downloads.push({
          name: 'framed ld+json',
          filename: formatFileName(this.entity, 'json'),
          href: this.framedUrlObject,
          hrefRaw: this.framedUrlObjectRaw,
          onClick: () => {
            if (window.navigator.msSaveOrOpenBlob) {
              window.navigator.msSaveOrOpenBlob(framedDataBlob, formatFileName(this.entity, 'json'));
            }
          }
        });
      }
    });
  }
}
